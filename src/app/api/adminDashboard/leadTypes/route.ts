import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';

// get all lead types logic

export async function GET() {
  try {
    const data = await mockDb.lead_types.findMany();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
