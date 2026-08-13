import { NextResponse } from 'next/server';
import { mockDb } from '@/app/libs/mock-db';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { createEvent } from '@/app/libs/events/events';
import { toZonedTime } from 'date-fns-tz';
import { auth } from '@/auth';
import { checkPermissions } from '@/app/libs/auth-helpers';

const timeZone = 'America/New_York';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions([74]);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const customerId = parseInt(params.id);
  const formData = await request.formData();

  const session = await auth();

  const userId = session?.user.id;

  const creditAppSchema = z.object({
    mssg: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = creditAppSchema.safeParse({
    mssg: formData.get('mssg'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { mssg } = validatedData.data;

  try {
    const res = {
      body: mssg,
      dateCreated: new Date(),
      sid: `SM-mock-${randomUUID()}`,
    };

    const sms = res.body;
    const createdAt = res.dateCreated;

    mockDb.client_sms.create({
      data: {
        message: sms,
        date_sent: createdAt,
        sent_by_user: true,
        message_sid: res.sid,
        manual_sent: false,
        status_id: 1,
        client_id: customerId,
        sender_user_id: userId ? userId : undefined,
      },
    });

    mockDb.clients.update({
      where: {
        id: customerId,
      },
      data: {
        consent_sent: true,
      },
    });

    if (userId) {
      await createEvent(
        'Credit App Form sent',
        userId,
        customerId,
        toZonedTime(new Date(), timeZone),
      );
    }

    return NextResponse.json({ successMessage: 'Credit App Form Sent' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}