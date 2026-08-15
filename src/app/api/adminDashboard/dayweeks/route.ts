import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await mockDb.user_schedule_dayweek.findMany();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
