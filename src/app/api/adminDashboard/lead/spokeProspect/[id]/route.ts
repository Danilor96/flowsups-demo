import { mockDb } from '@/app/libs/mock-db';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createEvent } from '@/app/libs/events/events';
import { auth } from '@/auth';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';
import { ensureActiveUserOrGetReplacement } from '@/app/libs/round-robin';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  const session = await auth();

  const userId = session?.user.id;

  const formData = await request.formData();

  const spokeProspectSchema = z
    .object({
      callIdToAddNote: z.string({ invalid_type_error: 'Please enter a valid value' }).nullish(),
      followUpDate: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
      followUpDateTime: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
      assignedTo: z
        .array(z.string({ invalid_type_error: 'Please enter a valid value' }))
        .min(1, 'Please enter a value'),
      reminderTime: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
      incoming: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
      outcoming: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
      note: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please write a note'),
      todaysDate: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      createdBy: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
    })
    .superRefine((data, ctx) => {
      const { followUpDate, followUpDateTime, incoming, outcoming, callIdToAddNote } = data;

      if (!incoming && !outcoming && !callIdToAddNote) {
        ctx.addIssue({
          path: ['incoming'],
          message: 'Please check inbound or outbound',
          code: 'custom',
        });
      }

      if (followUpDate && !followUpDateTime) {
        ctx.addIssue({
          path: ['followUpDate'],
          message: 'Please enter a day time to follow up date',
          code: 'custom',
        });
      }
    });

  const assignedArray = formData.get('assignedTo');

  const validatedData = spokeProspectSchema.safeParse({
    callIdToAddNote: formData.get('callIdToAddNote'),
    followUpDate: formData.get('followUpDate'),
    followUpDateTime: formData.get('followUpDateTime'),
    assignedTo: typeof assignedArray === 'string' ? JSON.parse(assignedArray) : [],
    reminderTime: formData.get('reminderTime'),
    incoming: formData.get('incoming'),
    outcoming: formData.get('outcoming'),
    note: formData.get('note'),
    todaysDate: formData.get('todaysDate'),
    createdBy: formData.get('createdBy'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    followUpDate,
    assignedTo,
    reminderTime,
    incoming,
    outcoming,
    note,
    todaysDate,
    createdBy,
    callIdToAddNote,
  } = validatedData.data;

  try {
    if (!userId) throw new Error('User not founded');

    let noteDataBody: {
      note: string;
      created_at: string;
      created_by_id: number;
      client_id: number;
      call?: { connect: { id: number } };
    } = {
      note: note,
      created_at: todaysDate,
      created_by_id: parseInt(createdBy),
      client_id: customerId,
    };

    if (callIdToAddNote) {
      noteDataBody = { ...noteDataBody, call: { connect: { id: parseInt(callIdToAddNote) } } };
    }

    const noteData = await mockDb.notes.create({
      data: noteDataBody,
    });

    if (!callIdToAddNote) {
      const call = await mockDb.client_calls.create({
        data: {
          call_date: new Date().toISOString(),
          call_duration: '0',
          user_id: [userId],
          call_status_id: 1,
          call_direction_id: incoming ? 1 : 2,
          inboundCall: incoming ? true : false,
          client_id: customerId,
          note_id: noteData.id,
          followUpDate: followUpDate,
        },
      });
    }

    let taskId: number | null = null;

    if (followUpDate) {
      for (let i = 0; i < assignedTo.length; i++) {
        const assignedIdNum = parseInt(assignedTo[i]);
        const assignedId = await ensureActiveUserOrGetReplacement(assignedIdNum, customerId);

        const task = await mockDb.tasks.create({
          data: {
            deadline: new Date(followUpDate).toISOString(),
            description: note,
            title: 'Spoke To Prospect',
            created_by: userId,
            status: 1,
            customer_id: customerId,
            assigned_to: assignedId,
            reminder_time_id: reminderTime ? Number(reminderTime) : undefined,
          },
        });

        if (i === 0) {
          taskId = task.id;
        }

        await mockDb.task_Notes.create({
          data: {
            note: note,
            created_by_id: userId,
            created_at: new Date().toISOString(),
            task_id: task.id,
          },
        });
      }
    }

      const leadAssignedToId = await ensureActiveUserOrGetReplacement(parseInt(assignedTo[0]), customerId);

      await mockDb.client_has_lead.create({
        data: {
          created_at: todaysDate,
          assigned_to_id: leadAssignedToId,
        client_id: customerId,
        status_id: 2,
        created_by_id: parseInt(createdBy),
        lead_id: 3,
        incoming: incoming ? true : false,
        outcoming: outcoming ? true : false,
        follow_up_date: followUpDate ? new Date(followUpDate).toISOString() : undefined,
        note_id: noteData.id,
        reminder_time: reminderTime ? Number(reminderTime) : undefined,
        task_id: taskId,
      },
    });

    const activeLead = await mockDb.leads.findFirst({
      where: {
        is_active: true,
        customer_id: customerId,
      },
    });

    const newLostStatus = [CustomersStatuses.New, CustomersStatuses.Lost];

    if (
      activeLead &&
      activeLead.customer_status_id &&
      newLostStatus.includes(activeLead.customer_status_id)
    ) {
      await mockDb.leads.update({
        where: {
          id: activeLead.id,
        },
        data: {
          customer_status_id: CustomersStatuses.Contacted,
        },
      });
    }

    const description = 'New Lead created: Spoke To Prospect';

    await createEvent(description, parseInt(createdBy), customerId, new Date(todaysDate));

    return NextResponse.json({ successMessage: 'Lead Successfully Created' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
