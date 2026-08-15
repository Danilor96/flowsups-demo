import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';

// get all lead sources logic

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = mockDb.banks.findMany();


    return NextResponse.json(data);
  } catch (error) {
    console.log(error);


    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
