import { mockDb } from '@/app/libs/mock-db';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createEvent } from '@/app/libs/events/events';

export async function POST(request: Request) {
  const formData = await request.formData();

  const vehicleScheduledSchema = z
    .object({
      createdBy: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      todaysDate: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      customer: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      assignedTo: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      reminderTime: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
      startDate: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      vehicle: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      note: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    })
    .refine((data) => data.vehicle, {
      path: ['vehicleSearch'],
      message: 'Please enter a value',
    });

  const validatedData = vehicleScheduledSchema.safeParse({
    createdBy: formData.get('createdBy'),
    todaysDate: formData.get('todaysDate'),
    customer: formData.get('customer'),
    assignedTo: formData.get('assignedTo'),
    reminderTime: formData.get('reminderTime'),
    startDate: formData.get('startDate'),
    vehicle: formData.get('vehicle'),
    note: formData.get('note'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { createdBy, customer, assignedTo, reminderTime, startDate, vehicle, note, todaysDate } =
    validatedData.data;

  const reminderValue = reminderTime === '1' ? 5 : reminderTime === '2' ? 10 : 15;

  try {
    let noteId: number | null = null;

    if (note) {
      const noteData = mockDb.notes.create({
        data: {
          note: note,
          created_at: todaysDate,
          created_by_id: parseInt(createdBy),
          client_id: parseInt(customer),
        },
      });

      noteId = noteData.id;
    }

    const data = mockDb.vehicle_delivery.create({
      data: {
        start_date: new Date(startDate),
        assigned_to: parseInt(assignedTo),
        created_by: parseInt(createdBy),
        customer_id: parseInt(customer),
        vehicle_id: parseInt(vehicle),
        reminder_time: reminderValue,
      },
    });

    const customerLead = mockDb.client_has_lead.create({
      data: {
        created_at: todaysDate,
        assigned_to_id: parseInt(assignedTo),
        client_id: parseInt(customer),
        status_id: 2,
        created_by_id: parseInt(createdBy),
        lead_id: 19,
        note_id: noteId,
      },
    });

    const customerData = mockDb.clients.update({
      where: {
        id: parseInt(customer),
      },
      data: {
        client_status_id: 4,
      },
    });

    const activeLead = mockDb.leads.findFirst({
      where: {
        customer_id: parseInt(customer),
        is_active: true,
      },
    });

    if (activeLead) {
      mockDb.leads.update({
        where: {
          id: activeLead.id,
          customer_id: parseInt(customer),
          is_active: true,
        },
        data: {
          customer_status_id: 4,
        },
      });
    }

    const description = 'New Lead created: Delivery Scheduled';

    await createEvent(description, parseInt(createdBy), parseInt(customer));

    return NextResponse.json({ successMessage: 'Delivery Successfully Scheduled' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
