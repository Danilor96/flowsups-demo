const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prisma';
import { z } from 'zod';
import twilio from 'twilio';
import { createEvent } from '@/app/libs/events/events';
import { toZonedTime } from 'date-fns-tz';
import { auth } from '@/auth';
import { checkPermissions } from '@/app/libs/auth-helpers';

const client = twilio(accountSid, authToken);

const url = process.env.TWILIO_WEBSOCKET_URL;

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
    const clientData = await prisma.clients.findUnique({
      where: {
        id: customerId,
      },
      select: {
        email: true,
        mobile_phone: true,
      },
    });

    const statusCallbacUrl = `${url}/smsStatus`;

    const res = await client.messages.create({
      body: mssg,
      from: twilioPhoneNumber,
      to: `${clientData?.mobile_phone}`,
      statusCallback: statusCallbacUrl,
    });

    const sms = res.body;
    const createdAt = res.dateCreated;

    const data = await prisma?.client_sms.create({
      data: {
        message: sms,
        date_sent: createdAt,
        sent_by_user: true,
        message_sid: res.sid,
        manual_sent: false,
        status: {
          connect: {
            id: 1,
          },
        },
        client_message: {
          connect: {
            id: customerId,
          },
        },
        user: {
          connect: {
            id: userId ? userId : undefined,
          },
        },
      },
      include: {
        user: {
          select: {
            name: true,
            last_name: true,
            id: true,
          },
        },
      },
    });

    const customer = await prisma.clients.update({
      where: {
        id: customerId,
      },
      data: {
        consent_sent: true,
      },
    });

    //await prisma.$disconnect();

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

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
