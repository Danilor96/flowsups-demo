import { checkPermissions } from '@/app/libs/auth-helpers';
import { createNotification } from '@/app/libs/notifications/notifications';
import { mockDb } from '@/app/libs/mock-db';
import { LeadHistoryCategoriesEnum } from '@/app/ui/dashboard/clientSystem/clientDetail/leadHistory/categoriesIdMap';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ensureActiveUserOrGetReplacement } from '@/app/libs/round-robin';

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions([29]);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const data = await request.formData();
  
  const session = await auth();

  const creator = session?.user.id;

  const managerTaskSchema = z.object({
    noteInput: z.string({ invalid_type_error: 'Please enter a valid value' }).min(1, 'Please enter a value').nullish(),
    assigned: z.array(z.string({ invalid_type_error: 'Please enter a valid value' })).min(1, 'Please enter a value'),
    finalDate: z.string({ invalid_type_error: 'Please enter a valid value' }).min(1, 'Please enter a value'),
    subject: z.string({ invalid_type_error: 'Please enter a valid value' }).min(1, 'Please enter a value'),
    customerId: z.string({ invalid_type_error: 'Please enter a valid value' }).nullish(),
    isTypeBank: z
      .string()
      .transform(val => val === 'true')
      .nullish(),
    isTaskBankForManager: z
      .string()
      .transform(val => val === 'true')
      .nullish(),
  });

  const assignedArray = data.get('assigned');

  const validatedData = managerTaskSchema.safeParse({
    noteInput: data.get('noteInput'),
    assigned: typeof assignedArray === 'string' && JSON.parse(assignedArray),
    finalDate: data.get('finalDate'),
    subject: data.get('subject'),
    customerId: data.get('customerId'),
    isTypeBank: data.get('isTypeBank'),
    isTaskBankForManager: data.get('isTaskBankForManager'),
  });
  console.log({ data: data.get('subject') });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { finalDate, noteInput, assigned, subject, customerId, isTypeBank, isTaskBankForManager } = validatedData.data;
  const forManager = isTaskBankForManager !== undefined && isTaskBankForManager !== null ? isTaskBankForManager : true;

  try {
    if (creator) {
      for (let i = 0; i < assigned.length; i++) {
        const assignedIdNum = parseInt(assigned[i]);
        const assignedId = await ensureActiveUserOrGetReplacement(assignedIdNum, customerId ? parseInt(customerId) : undefined);

        const task = await mockDb.tasks.create({
          data: {
            deadline: finalDate,
            description: noteInput && !isTypeBank ? noteInput : '',
            title: subject,
            assigned_to: assignedId,
            created_by: creator,
            status: 1,
            manager_task: forManager,
            customer_id: customerId ? parseInt(customerId) : undefined,
            is_funding_task: isTypeBank ? isTypeBank : false,
          },
        });

        if(isTypeBank && noteInput) {
          const taskNote = await mockDb.task_Notes.create({
            data: {
              created_at: new Date().toISOString(),
              note: noteInput || '',
              created_by_id: creator,
              task_id: task.id,
            },
          });

          if (customerId) {
            const regularNote = await mockDb.notes.create({
              data: {
                created_at: new Date().toISOString(),
                note: `Pending to Fund: ${subject}. ${noteInput}`,
                created_by_id: creator,
                client_id: parseInt(customerId),
              },
            });
            await mockDb.client_has_lead.create({
              data: {
                created_at: new Date().toISOString(),
                assigned_to_id: assignedId,
                client_id: parseInt(customerId),
                created_by_id: creator,
                lead_id: LeadHistoryCategoriesEnum.AddTask,
                status_id: 2,
                task_id: task.id,
                note_id: regularNote.id,
              },
            });
          }
        }

        await createNotification({
          message: isTypeBank ? `You have a new task (Pending to Fund): ${subject}` : `You have a new task: ${subject}`,
          notificationType: {
            general: true,
          },
          assignedToId: assignedId,
          eventTypeId: 4,
          taskId: task?.id,
        });
      }
    }

    if (!creator) {
      throw 'No creator found';
    }

    return NextResponse.json({ successMessage: 'Manager Task Successfully Created' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
