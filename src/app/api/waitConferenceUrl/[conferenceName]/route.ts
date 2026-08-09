import twilio from 'twilio';

const nextAppUrl = process.env.NEXT_API_URL;

export async function POST(request: Request, { params }: { params: { conferenceName: string } }) {
  const conferenceName = params.conferenceName;

  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();

  try {
    twiml.say('Your call is being transferred to an sales representative. Please wait.');
    twiml.play(
      {
        loop: 0,
      },
      `${nextAppUrl}/outgoingCallRinginSound.mp3`,
    );

    return new Response(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.log(error);

    twiml.say('Thanks for using Flowsups. Good Bye!');

    return new Response(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}
