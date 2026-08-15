import { checkPermissions } from '@/app/libs/auth-helpers';
import { createEvent } from '@/app/libs/events/events';
import { createGeneralLead } from '@/app/libs/generalLead/generalLead';
import { createNotification } from '@/app/libs/notifications/notifications';
import { mockDb } from '@/app/libs/mock-db';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET() {
  try {
    const data = await mockDb.notes.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions(20);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const noteEsquema = z.object({
    note: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    created_by: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    from: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    client_id: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    today: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = noteEsquema.safeParse({
    note: formData.get('note'),
    created_by: formData.get('created_by'),
    from: formData.get('from'),
    client_id: formData.get('client_id'),
    today: formData.get('today'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldError: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { note, client_id, created_by, from, today } = validatedData.data;

  try {
    const created = await mockDb.notes.create({
      data: {
        note: note,
        created_at: new Date().toISOString(),
        client_id: parseInt(client_id),
        created_by_id: parseInt(created_by),
        from_id: from ? parseInt(from) : undefined,
      },
    });

    const createdByUser = mockDb.users.findUnique({
      where: {
        id: parseInt(created_by),
      },
    });

    const clientNote = mockDb.clients.findUnique({
      where: {
        id: parseInt(client_id),
      },
    });

    const data = {
      ...created,
      created_by: createdByUser
        ? {
            name: createdByUser.name,
            last_name: createdByUser.last_name,
            id: createdByUser.id,
            email: createdByUser.email,
          }
        : null,
      client_note: clientNote
        ? {
            id: clientNote.id,
            name_lastname: clientNote.name_lastname,
            first_name: clientNote.first_name,
            last_name: clientNote.last_name,
            seller_id: clientNote.seller_id,
          }
        : null,
    };

    const notiMessage = `${data?.created_by?.name} ${
      data?.created_by?.last_name
    } has created a new note for customer ${data?.client_note?.first_name || ''} ${
      data?.client_note?.last_name || ''
    } `;
    //
    await createNotification({
      message: notiMessage,
      notificationType: {
        general: true,
      },
      customerId: parseInt(client_id),
      notificationsForManagers: true,
      assignedToId: data.client_note.seller_id,
      eventTypeId: 2,
    });

    const eventMessage = 'New note created';

    await createEvent(eventMessage, parseInt(created_by), parseInt(client_id), new Date(today));

    await createGeneralLead(
      created_by,
      today,
      data.client_note.id,
      1,
      data.client_note.seller_id?.toString(),
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      data.id,
    );

    return NextResponse.json({ successMessage: 'Note Created', data: data }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
