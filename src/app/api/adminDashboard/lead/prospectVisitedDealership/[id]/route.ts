import { z } from 'zod';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { createEvent } from '@/app/libs/events/events';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  const formData = await request.formData();

  const noteSchema = z.object({
    followUpDate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
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
  });

  const assignedArray = formData.get('assignedTo');

  const validatedData = noteSchema.safeParse({
    followUpDate: formData.get('followUpDate'),
    assignedTo: typeof assignedArray === 'string' ? JSON.parse(assignedArray) : [],
    reminderTime: formData.get('reminderTime'),
    note: formData.get('note'),
    createdBy: formData.get('createdBy'),
    todaysDate: formData.get('todaysDate'),
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

    await prisma.client_has_lead.create({
      data: {
        created_at: todaysDate,
        assigned_to_id: parseInt(assignedTo[0]),
        client_id: customerId,
        status_id: 2,
        created_by_id: parseInt(createdBy),
        lead_id: 11,
        follow_up_date: new Date(followUpDate),
        note_id: noteId,
        reminder_time: reminderTime ? Number(reminderTime) : undefined,
      },
    });

    //await prisma.$disconnect();

    const description = 'New Lead created: Prospect Visited Dealership';

    await createEvent(description, parseInt(createdBy), customerId);

    return NextResponse.json({ successMessage: 'Lead Successfully Created' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
