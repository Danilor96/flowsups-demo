import { mockDb } from '@/app/libs/mock-db';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createEvent } from '@/app/libs/events/events';
import { createNotification } from '@/app/libs/notifications/notifications';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  const formData = await request.formData();

  const markAsLostSchema = z.object({
    lostReason: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    note: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    lostReasonDescription: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .optional(),
    todaysDate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    createdBy: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = markAsLostSchema.safeParse({
    lostReason: formData.get('lostReason'),
    note: formData.get('note'),
    lostReasonDescription: formData.get('lostReasonDescription'),
    todaysDate: formData.get('todaysDate'),
    createdBy: formData.get('createdBy'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { createdBy, lostReason, todaysDate, note, lostReasonDescription } = validatedData.data;

  try {
    let noteId: number | null = null;

    await mockDb.notes.create({
      data: {
        note: lostReasonDescription || '',
        created_at: todaysDate,
        created_by_id: parseInt(createdBy),
        client_id: customerId,
        from_id: 3,
      },
    });

    if (note) {
      const noteData = await mockDb.notes.create({
        data: {
          note: note,
          created_at: todaysDate,
          created_by_id: parseInt(createdBy),
          client_id: customerId,
          from_id: 3,
        },
      });

      noteId = noteData.id;
    }

    const customerData = await mockDb.clients.update({
      where: {
        id: customerId,
      },
      data: {
        client_status_id: 12,
        lost_date: new Date(todaysDate),
        client_status_changed_at: new Date(),
        lost_reason_id: Number(lostReason),
      },
    });

    const activeLead = await mockDb.leads.findFirst({
      where: {
        customer_id: customerId,
        is_selected: true,
      },
    });

    if (activeLead) {
      await mockDb.leads.update({
        where: {
          id: activeLead.id,
          customer_id: customerId,
          is_selected: true,
        },
        data: {
          customer_status_id: 12,
        },
      });
    }

    await mockDb.client_has_lead.create({
      data: {
        created_at: todaysDate,
        client_id: customerId,
        status_id: 2,
        created_by_id: parseInt(createdBy),
        lead_id: 15,
        note_id: noteId,
      },
    });

    const description = 'New Lead created: Mark As Lost';

    await createEvent(description, parseInt(createdBy), customerId);

    const notiMessage = `Customer ${customerData.first_name} ${customerData.last_name} has been marked as lost`;
    //
    await createNotification({
      message: notiMessage,
      notificationType: {
        general: true,
      },
      notificationsForManagers: true,
      exclusiveManagerNotification: true,
      customerId: customerId,
      eventTypeId: 5,
    });

    return NextResponse.json({ successMessage: 'Lead Successfully Created' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
