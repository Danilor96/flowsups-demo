import { NextResponse } from 'next/server';
import { z } from 'zod';
import twilio from 'twilio';
import prisma from '@/app/libs/prisma';

const authToken: string = process.env.TWILIO_AUTH_TOKEN || '';
const accountSid: string = process.env.TWILIO_ACCOUNT_SID || '';
const accountPhoneNumber: string = process.env.TWILIO_PHONE_NUMBER || '';

const statusCallbackUrl = process.env.TWILIO_WEBSOCKET_URL;

const client = twilio(accountSid, authToken);

export async function POST(request: Request, { params }: { params: { conferenceSid: string } }) {
  const conferenceSid = params.conferenceSid;

  const formData = await request.formData();

  const currentCallSchema = z.object({
    conferenceName: z.string({ invalid_type_error: 'Please enter a value' }).min(1),
    salesrepnum: z.string({ invalid_type_error: 'Please enter a value' }).nullable(),
    bdcnum: z.string({ invalid_type_error: 'Please enter a value' }).nullable(),
  });

  const validatedData = currentCallSchema.safeParse({
    conferenceName: formData.get('conferenceName'),
    salesrepnum: formData.get('salesrepnum'),
    bdcnum: formData.get('bdcnum'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { salesrepnum, bdcnum, conferenceName } = validatedData.data;

  try {
    const conferenceInProgess = await client.conferences(conferenceSid).fetch();
    const participantsList = await conferenceInProgess.participants().list();

    const customerCall = participantsList.find(
      (participant) => participant.endConferenceOnExit === true,
    );

    const handleCustomer = async () => {
      const customerCallSid = customerCall?.callSid;

      if (customerCallSid && participantsList.length > 1) {
        await client.conferences(conferenceSid).participants(customerCallSid).update({
          hold: true,
          endConferenceOnExit: true,
        });
      }
    };

    const customerPhoneNumber = await prisma?.client_calls.findUnique({
      where: {
        call_sid: conferenceSid,
      },
      select: {
        phone_number: true,
      },
    });

    const handleCreateCall = (number: string | null) => {
      return {
        from: accountPhoneNumber,
        to: `+1${number}`,
        statusCallback: `${statusCallbackUrl}/getCurrentConferenceCallStatus/${conferenceName}.${conferenceSid}?customerPhone=${customerPhoneNumber?.phone_number}`,
        statusCallbackEvent: ['answered', 'completed', 'initiated', 'ringing'],
        statusCallbackMethod: 'POST',
        endConferenceOnExit: true,
        timeout: 20,
      };
    };

    if (
      conferenceInProgess.status !== 'completed' &&
      participantsList.length > 0 &&
      (salesrepnum || bdcnum)
    ) {
      await handleCustomer();

      await client
        .conferences(conferenceSid)
        .participants.create(handleCreateCall(salesrepnum || bdcnum))
        .catch((reason) => {
          console.log(reason);

          return NextResponse.json({ twilioError: 'Twilio Error' }, { status: 500 });
        });
    }

    return NextResponse.json({ successMessage: 'Call Successfully Transferred' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
