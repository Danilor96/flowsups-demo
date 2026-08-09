import { NextResponse } from 'next/server';
import twilio from 'twilio';
import prisma from '@/app/libs/prisma';

export async function POST(request: Request) {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();

  try {
    const formData = await request.formData();

    console.log(formData);

    const callStatus = formData.get('DialCallStatus')?.toString();
    const callDuration = formData.get('DialCallDuration')?.toString() || '0';
    const callSid = formData.get('CallSid')?.toString();

    await prisma.$transaction(async (prisma) => {
      const callStatusData = await prisma.call_statuses.findFirst({
        where: {
          status: callStatus,
        },
      });

      if (callStatusData && callDuration && callSid) {
        const data = await prisma.client_calls.update({
          where: {
            call_sid: callSid,
          },
          data: {
            call_status_id: callStatusData.id,
            call_duration: callDuration,
          },
        });
      }
    });

    twiml.say('Thanks for using Flowsups. Good bye!');

    return NextResponse.json(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.log(error);

    twiml.say('Thanks for using Flowsups. Good Bye!');

    return NextResponse.json(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}
