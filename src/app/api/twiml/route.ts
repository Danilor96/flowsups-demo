import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { mockDb } from '@/app/libs/mock-db';

const statusCallbackUrl = process.env.TWILIO_WEBSOCKET_URL;

export async function POST(request: Request) {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();

  try {
    const formData = await request.formData();

    const callTo = formData.get('To')?.toString();

    const businesPhoneNumberActive = mockDb.business_phone_numbers.findFirst({
      where: {
        is_publishing_number: true,
      },
    });

    if (!businesPhoneNumberActive) {
      return NextResponse.json({ serverError: 'Phone number not found' }, { status: 404 });
    }

    const currentConference =
      callTo && callTo.includes('conference') ? { friendlyName: callTo } : undefined;

    const dial = twiml.dial({
      callerId: businesPhoneNumberActive?.phone_number,
    });

    if (callTo) {
      if (callTo.includes('conference')) {
        if (currentConference) {
          dial.conference(
            {
              startConferenceOnEnter: true,
            },
            callTo,
          );
        } else {
          twiml.say('The call you are trying to join is not available. Goodbye!');

          return new Response(twiml.toString(), {
            headers: {
              'Content-Type': 'text/xml',
            },
          });
        }
      } else {
        dial.number(
          {
            statusCallback: `${statusCallbackUrl}/getCurrentCallStatus`,
            statusCallbackEvent: ['answered', 'completed', 'initiated', 'ringing'],
            statusCallbackMethod: 'POST',
          },
          callTo,
        );
      }
    } else {
      twiml.say('The number you dialed is not valid');

      return new Response(twiml.toString(), {
        headers: {
          'Content-Type': 'text/xml',
        },
      });
    }

    twiml.say('Thanks for using Flowsups. Goodbye!');

    return new Response(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.log(error);

    twiml.say('Thanks for using Flowsups. GoodBye!');

    return NextResponse.json(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}