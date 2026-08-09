import prisma from '@/app/libs/prisma';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createEvent } from '@/app/libs/events/events';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  const formData = await request.formData();

  const noteSchema = z.object({
    note: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    todaysDate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    createdBy: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = noteSchema.safeParse({
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

  const { createdBy, todaysDate, note } = validatedData.data;

  try {
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

    await prisma.client_has_lead.create({
      data: {
        created_at: todaysDate,
        client_id: customerId,
        status_id: 2,
        created_by_id: parseInt(createdBy),
        lead_id: 16,
        note_id: noteData.id,
      },
    });

    //await prisma.$disconnect();

    const description = 'New Lead created: Prospect Requested Dnc';

    await createEvent(description, parseInt(createdBy), customerId);

    return NextResponse.json({ successMessage: 'Lead Successfully Created' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
