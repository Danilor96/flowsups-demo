import { z } from 'zod';
import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { createEvent } from '@/app/libs/events/events';
import { createNotification } from '@/app/libs/notifications/notifications';
import { createGeneralLead } from '@/app/libs/generalLead/generalLead';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  const formData = await request.formData();

  const noteSchema = z.object({
    // followUpDate: z
    //   .string({ invalid_type_error: 'Please enter a valid value' })
    //   .min(1, 'Please enter a value'),
    // assignedTo: z
    //   .string({ invalid_type_error: 'Please enter a valid value' })
    //   .min(1, 'Please enter a value'),
    // reminderTime: z
    //   .string({ invalid_type_error: 'Please enter a valid value' })
    //   .min(1, 'Please enter a value'),
    note: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    userId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    todayDate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = noteSchema.safeParse({
    // followUpDate: formData.get('followUpDate'),
    // assignedTo: formData.get('assignedTo'),
    // reminderTime: formData.get('reminderTime'),
    note: formData.get('note'),
    userId: formData.get('userId'),
    todayDate: formData.get('todayDate'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    // assignedTo,
    // followUpDate,
    note,
    // reminderTime,
    userId,
    todayDate,
  } = validatedData.data;

  try {
    const noteData = await mockDb.notes.create({
      data: {
        note: note,
        created_at: new Date(todayDate),
        created_by_id: parseInt(userId),
        client_id: customerId,
      },
    });

    const client = mockDb.clients.findUnique({
      where: {
        id: customerId,
      },
    });

    const description = 'Note created';

    await createEvent(description, parseInt(userId), customerId);
    //
    const message = `A new note has been created for customer ${client?.first_name} ${client?.last_name}`;

    await createNotification({
      message: message,
      notificationType: {
        general: true,
      },
      assignedToId: client?.seller_id,
      customerId: client?.id,
      eventTypeId: 2,
    }).catch((error) => {
      throw error;
    });

    await createGeneralLead(
      userId,
      todayDate,
      customerId,
      1,
      undefined,
      undefined,
      1,
      undefined,
      undefined,
      undefined,
      noteData.id,
    ).catch((error) => {
      throw error;
    });

    return NextResponse.json({ successMessage: 'Lead Successfully Created' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
