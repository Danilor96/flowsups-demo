import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = twilio(accountSid, authToken);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const areaCode = searchParams.get('areaCode') || undefined;

    const availableNumbers = await twilioClient.availablePhoneNumbers('US').local.list({  
      limit: 40,
      areaCode: areaCode && !isNaN(Number(areaCode)) ? Number(areaCode) : undefined
    });

    if (availableNumbers.length === 0) {
      return NextResponse.json(
        { error: 'No hay números disponibles con los criterios seleccionados.' },
        { status: 404 },
      );
    }

    return NextResponse.json(availableNumbers, { status: 200 });
  } catch (error) {
    console.error('Error fetching Twilio numbers:', error);
    return NextResponse.json({ serverError: 'Error fetching numbers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const areaCode = searchParams.get('areaCode') || undefined;

    const availableNumbers = await twilioClient.availablePhoneNumbers('US').local.list({  
      limit: 40,
      areaCode: areaCode && !isNaN(Number(areaCode)) ? Number(areaCode) : undefined
    });

    if (availableNumbers.length === 0) {
      return NextResponse.json(
        { error: 'No hay números disponibles con los criterios seleccionados.' },
        { status: 404 },
      );
    }

    return NextResponse.json(availableNumbers, { status: 200 });
  } catch (error) {
    console.error('Error fetching Twilio numbers:', error);
    return NextResponse.json({ serverError: 'Error fetching numbers' }, { status: 500 });
  }
}