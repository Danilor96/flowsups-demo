import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';

// get all appointments statuses logic

export async function GET() {
  try {
    const data = await mockDb.appointments_status.findMany();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
