import { NextResponse } from 'next/server';
import twilio from 'twilio';
import prisma from '@/app/libs/prisma';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const TWILIO_WEBSOCKET_URL = process.env.TWILIO_WEBSOCKET_URL || 'localhost:3000';
const MESSAGING_SERVICE_SID = process.env.TWILIO_MESSAGING_SERVICE_SID || '';

const client = twilio(accountSid, authToken);


export async function GET() {
  // by Bussiness (td)
  try {
    // const incomingPhoneNumbers = await client.incomingPhoneNumbers.list();
    // deberia ser por business id (multi tenant)
    const businessId = 1;
    const registeredNumbers = await prisma.business_phone_numbers.findMany({
      where: {
        business_id: businessId,
      },
      orderBy: {
        is_publishing_number: 'desc',
      },
    });
    return NextResponse.json(registeredNumbers, { status: 200 });
  } catch (error) {
    console.error('Error fetching Twilio numbers:', error);
    return NextResponse.json({ serverError: 'Error fetching numbers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { phoneNumber } = await request.json();
  if (!phoneNumber) {
    return NextResponse.json({ error: 'Please enter a number' }, { status: 422 });
  }

  
  try {
    // Deberia ser por business Id (multi tenant)
    const busines = await prisma.business.findFirst();
    if (!busines) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const purchasedNumber = await client.incomingPhoneNumbers.create({
      phoneNumber,
      friendlyName: `Busines Id: ${busines.id}`,
      voiceUrl: `${TWILIO_WEBSOCKET_URL}/incomingCall?businessPhoneNumber=${phoneNumber}&businessId=${busines.id}`,
      voiceMethod: 'POST',
      smsUrl: `${TWILIO_WEBSOCKET_URL}/getMessage?businessPhoneNumber=${phoneNumber}&businessId=${busines.id}`,
      smsMethod: 'POST',
    });

    // This 'activates' the number to send messages through the service.
    await client.messaging.v1
      .services(MESSAGING_SERVICE_SID)
      .phoneNumbers.create({ phoneNumberSid: purchasedNumber.sid });

    const newPhoneNumberRecord = await prisma.business_phone_numbers.create({
      data: {
        business_id: busines.id,
        twilio_sid: purchasedNumber.sid,
        phone_number: purchasedNumber.phoneNumber,
        friendly_name: purchasedNumber.friendlyName,
      },
    });

    return NextResponse.json({ successMessage: 'Number added successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error fetching Twilio numbers:', error);
    return NextResponse.json({ serverError: 'Error fetching numbers' }, { status: 500 });
  }
}
