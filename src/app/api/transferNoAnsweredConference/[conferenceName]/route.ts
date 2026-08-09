import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { z } from 'zod';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const websocketPublicUrl = process.env.TWILIO_WEBSOCKET_URL;
const accountPhoneNumber: string = process.env.TWILIO_PHONE_NUMBER || '';
const client = twilio(accountSid, authToken);

export async function POST(request: Request, { params }: { params: { conferenceName: string } }) {
  const conferenceName = params.conferenceName;

  const formData = await request.formData();

  const currentCallSchema = z.object({
    conferenceSid: z.string({ invalid_type_error: 'Please enter a value' }).min(1),
    salesrepnum: z.string({ invalid_type_error: 'Please enter a value' }).nullable(),
    bdcnum: z.string({ invalid_type_error: 'Please enter a value' }).nullable(),
  });

  const validatedData = currentCallSchema.safeParse({
    conferenceSid: formData.get('conferenceSid'),
    salesrepnum: formData.get('salesrepnum'),
    bdcnum: formData.get('bdcnum'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { bdcnum, conferenceSid, salesrepnum } = validatedData.data;

  try {
    const data = await prisma.conferences_names.update({
      where: {
        conference_name: conferenceName,
      },
      data: {
        answered: true,
      },
    });

    const conferenceInProgess = await client.conferences(conferenceSid).fetch();
    const participantsList = await conferenceInProgess.participants().list();

    const callCreation = async (phoneNumber: string) => {
      await client
        .conferences(conferenceSid)
        .participants.create({
          from: accountPhoneNumber,
          to: `+1${phoneNumber}`,
          statusCallback: `${websocketPublicUrl}/getCurrentConferenceCallStatus/${conferenceName}.${conferenceSid}`,
          statusCallbackEvent: ['answered', 'completed', 'initiated', 'ringing'],
          statusCallbackMethod: 'POST',
          endConferenceOnExit: true,
          timeout: 12,
        })
        .catch((reason) => {
          console.log(reason);
        });
    };

    if (conferenceInProgess.status !== 'completed' && participantsList.length > 0) {
      if (salesrepnum) {
        await callCreation(salesrepnum);
      }

      if (bdcnum) {
        await callCreation(bdcnum);
      }
    }

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Transfer Successfully Completed' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
