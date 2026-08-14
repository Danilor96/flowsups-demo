import { NextResponse } from 'next/server';
import { mockDb } from '@/app/libs/mock-db';

export async function GET() {
  try {
    const data = mockDb.vehicle_conditions.findMany();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
