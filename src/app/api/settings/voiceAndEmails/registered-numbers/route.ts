import { NextResponse } from 'next/server';
import { mockDb } from '@/app/libs/mock-db';

export async function GET() {
  // by Bussiness (td)
  try {
    // const incomingPhoneNumbers = await client.incomingPhoneNumbers.list();
    // deberia ser por business id (multi tenant)
    const businessId = 1;
    const registeredNumbers = mockDb.business_phone_numbers.findMany({
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
    const busines = mockDb.business.findFirst();
    if (!busines) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const purchasedNumber = {
      sid: `PN${Math.random().toString(36).slice(2, 16)}`,
      phoneNumber,
      friendlyName: `Busines Id: ${busines.id}`,
    };

    const newPhoneNumberRecord = mockDb.business_phone_numbers.create({
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