import { NextResponse } from 'next/server';
import twilio from 'twilio';

export const dynamic = 'force-dynamic';

const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const apiKey = process.env.TWILIO_API_KEY || '';
const apiSecret = process.env.TWILIO_API_SECRET || '';

export async function GET(request: Request, { params }: { params: { email: string } }) {
  const userEmail = params.email;

  try {
    const AccessToken = twilio.jwt.AccessToken;
    const VoicenGrant = AccessToken.VoiceGrant;

    const token = new AccessToken(accountSid, apiKey, apiSecret, {
      identity: userEmail ?? 'flowsups',
      ttl: 86400,
    });

    const voiceGrant = new VoicenGrant({
      outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
      incomingAllow: true,
    });

    token.addGrant(voiceGrant);

    const tokenJwt = token.toJwt();

    return NextResponse.json({ token: tokenJwt });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
