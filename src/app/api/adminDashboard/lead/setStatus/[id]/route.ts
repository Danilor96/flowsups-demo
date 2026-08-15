import { z } from 'zod';
import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { createEvent } from '@/app/libs/events/events';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  const formData = await request.formData();

  const noteSchema = z
    .object({
      followUpDate: z.string({ invalid_type_error: 'Please enter a valid value' }).nullish(),
      assignedTo: z
        .array(z.string({ invalid_type_error: 'Please enter a valid value' }))
        .optional(),
      reminderTime: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
      note: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
      createdBy: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      todaysDate: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      status: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      lostReasonDescription: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .nullish(),
      lostReason: z.coerce.number({ invalid_type_error: 'Please enter a valid value' }).nullish(),
    })
    .superRefine((data, ctx) => {
      const noLostReasonSelected = data.status === '12' && !data.lostReason;

      if (noLostReasonSelected) {
        ctx.addIssue({
          path: ['lostReason'],
          message: 'Lost reason require',
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
    status: formData.get('status'),
    lostReasonDescription: formData.get('lostReasonDescription'),
    lostReason: formData.get('lostReason'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    assignedTo,
    followUpDate,
    note,
    reminderTime,
    createdBy,
    todaysDate,
    status,
    lostReason,
    lostReasonDescription,
  } = validatedData.data;

  try {
    let noteId: number | null = null;

    if (status === '12') {
      const lostNote = await mockDb.notes.create({
        data: {
          note: lostReasonDescription || '',
          created_at: todaysDate,
          created_by_id: parseInt(createdBy),
          client_id: customerId,
          from_id: 3,
        },
      });
    }

    if (note) {
      const noteData = await mockDb.notes.create({
        data: {
          note: note,
          created_at: todaysDate,
          created_by_id: parseInt(createdBy),
          client_id: customerId,
          from_id: status === '12' ? 3 : null,
        },
      });

      noteId = noteData.id;
    }

    await mockDb.clients.update({
      where: {
        id: customerId,
      },
      data: {
        client_status_id: parseInt(status),
        client_status_changed_at: new Date(),
        deleted: status !== '12' ? false : null,
        lost_reason_id: status === '12' ? lostReason : null,
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
          customer_status_id: parseInt(status),
        },
      });
    }

    await mockDb.client_has_lead.create({
      data: {
        created_at: todaysDate,
        assigned_to_id: assignedTo && assignedTo.length > 0 ? parseInt(assignedTo[0]) : null,
        client_id: customerId,
        status_id: 2,
        created_by_id: parseInt(createdBy),
        lead_id: 18,
        follow_up_date: followUpDate ? new Date(followUpDate) : null,
        note_id: noteId,
      },
    });

    const description = 'New Lead created: Set Status';

    await createEvent(description, parseInt(createdBy), customerId);

    return NextResponse.json({ successMessage: 'Lead Successfully Created' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
