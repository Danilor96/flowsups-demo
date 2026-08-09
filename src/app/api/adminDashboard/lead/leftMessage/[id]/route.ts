import { z } from 'zod';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { createEvent } from '@/app/libs/events/events';
import { auth } from '@/auth';
import { ensureActiveUserOrGetReplacement } from '@/app/libs/round-robin';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  const session = await auth();

  const userId = session?.user.id;

  const formData = await request.formData();

  const noteSchema = z
    .object({
      followUpDate: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      followUpDateTime: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
      assignedTo: z
        .array(z.string({ invalid_type_error: 'Please enter a valid value' }))
        .min(1, 'Please enter a value'),
      reminderTime: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      note: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
      createdBy: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      todaysDate: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
    })
    .superRefine((data, ctx) => {
      const { followUpDate, note, followUpDateTime } = data;

      if (followUpDate && !note) {
        ctx.addIssue({
          path: ['note'],
          message: 'Please write a note',
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

  const validatedData = noteSchema.safeParse({
    followUpDate: formData.get('followUpDate'),
    assignedTo: typeof assignedArray === 'string' ? JSON.parse(assignedArray) : [],
    reminderTime: formData.get('reminderTime'),
    note: formData.get('note'),
    createdBy: formData.get('createdBy'),
    todaysDate: formData.get('todaysDate'),
    followUpDateTime: formData.get('followUpDateTime'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { assignedTo, followUpDate, note, reminderTime, createdBy, todaysDate } =
    validatedData.data;

  try {
    if (!userId) throw new Error('User not founded');

    let noteId: number | null = null;

    if (note) {
      const noteData = await prisma?.notes.create({
        data: {
          note: note,
          created_at: todaysDate,
          created_by_id: parseInt(createdBy),
          client_id: customerId,
        },
        select: {
          id: true,
        },
      });

      noteId = noteData.id;
    }

    const call = await prisma.client_calls.create({
      data: {
        call_date: new Date().toISOString(),
        call_duration: '0',
        user_id: [userId],
        call_status_id: 1,
        call_direction_id: 2,
        inboundCall: false,
        client_id: customerId,
        note_id: noteId,
        followUpDate: followUpDate,
      },
    });

    let taskId: number | null = null;

    if (followUpDate && note) {
      for (let i = 0; i < assignedTo.length; i++) {
        const assignedIdNum = parseInt(assignedTo[i]);
        const assignedId = await ensureActiveUserOrGetReplacement(assignedIdNum, customerId);

        const task = await prisma.tasks.create({
          data: {
            deadline: new Date(followUpDate).toISOString(),
            description: note,
            title: 'Left Message',
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

        await prisma.task_Notes.create({
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

      await prisma.client_has_lead.create({
        data: {
          created_at: todaysDate,
          assigned_to_id: leadAssignedToId,
        client_id: customerId,
        status_id: 2,
        created_by_id: parseInt(createdBy),
        lead_id: 4,
        follow_up_date: followUpDate,
        note_id: noteId,
        reminder_time: reminderTime ? Number(reminderTime) : undefined,
        task_id: taskId,
      },
    });

    const description = 'New Lead created: Left Message';

    await createEvent(description, parseInt(createdBy), customerId);

    return NextResponse.json({ successMessage: 'Lead Successfully Created' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
