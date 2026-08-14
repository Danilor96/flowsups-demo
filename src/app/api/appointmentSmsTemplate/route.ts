import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = mockDb.appointmentSms.findFirst();

    //await prisma.$disconnect();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
