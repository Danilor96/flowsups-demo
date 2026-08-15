import { z } from 'zod';
import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { createEvent } from '@/app/libs/events/events';
import { createNotification } from '@/app/libs/notifications/notifications';
import { ensureActiveUserOrGetReplacement } from '@/app/libs/round-robin';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  const formData = await request.formData();

  const addTaskSchedule = z.object({
    dueDate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    reminderTime: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    assignedTo: z
      .array(z.string({ invalid_type_error: 'Please enter a valid value' }))
      .min(1, 'Please enter a value'),
    subject: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    note: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    todayDate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    userId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const assignedArray = formData.get('assignedTo');

  const validatedData = addTaskSchedule.safeParse({
    dueDate: formData.get('dueDate'),
    reminderTime: formData.get('reminderTime'),
    assignedTo: typeof assignedArray === 'string' ? JSON.parse(assignedArray) : [],
    subject: formData.get('subject'),
    note: formData.get('note'),
    todayDate: formData.get('todayDate'),
    userId: formData.get('userId'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { dueDate, reminderTime, assignedTo, subject, note, todayDate, userId } =
    validatedData.data;

  try {
    const usersEmails: string[] = [];

    const customer = await mockDb.clients.findUnique({
      where: {
        id: customerId,
      },
    });

    let taskId: number | null = null;

    for (let i = 0; i < assignedTo.length; i++) {
      const assignedIdNum = parseInt(assignedTo[i]);
      const assignedId = await ensureActiveUserOrGetReplacement(assignedIdNum, customerId);

      const data = await mockDb.tasks.create({
        data: {
          deadline: new Date(dueDate).toISOString(),
          description: note
            ? note
            : `Follow up with ${customer?.first_name || ''} ${customer?.last_name || ''}`,
          title: subject,
          created_by: parseInt(userId),
          created_at: new Date(todayDate),
          status: 1,
          assigned_to: assignedId,
          customer_id: customerId,
          reminder_time_id: reminderTime && reminderTime !== '1' ? parseInt(reminderTime) : null,
        },
      });

      if (i === 0) {
        taskId = data.id;
      }

      const activeLead = await mockDb.leads.findFirst({
        where: {
          is_selected: true,
          customer_id: customerId,
        },
      });

      if (activeLead && activeLead.id) {
        const lead = mockDb.leads.findFirst({
          where: {
            id: activeLead.id,
            is_selected: true,
            customer_id: customerId,
          },
        });

        if (lead) {
          mockDb.leads.update({
            where: {
              id: lead.id,
            },
            data: {
              task_id: [...(lead.task_id || []), data.id],
            },
          });
        }
      }

      const assignedUser = mockDb.users.findUnique({
        where: {
          id: assignedId,
        },
      });

      if (assignedUser?.email) usersEmails.push(assignedUser.email);

      const notiMessage = `You have a new task`;

      await createNotification({
        message: notiMessage,
        notificationType: {
          general: true,
        },
        assignedToId: assignedId,
        eventTypeId: 4,
        taskId: data.id,
      });
    }

    const eventDescription = 'Task created';

    await createEvent(eventDescription, parseInt(userId), customerId, new Date(todayDate));

    const noteData = await mockDb.notes.create({
      data: {
        note: note
          ? note
          : `Follow up with ${customer?.first_name || ''} ${customer?.last_name || ''}`,
        created_at: new Date(todayDate),
        created_by_id: parseInt(userId),
        client_id: customerId,
      },
    });

    await mockDb.client_has_lead.create({
      data: {
        client_id: customerId,
        created_by_id: parseInt(userId),
        created_at: new Date(todayDate),
        status_id: 1,
        lead_id: 17,
        task_id: taskId,
        reminder_time: reminderTime ? parseInt(reminderTime) : null,
        note_id: noteData.id,
      },
    });

    return NextResponse.json({
      successMessage: 'Task Successfully Created',
      data: usersEmails,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
