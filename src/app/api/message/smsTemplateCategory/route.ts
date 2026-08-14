import { NextResponse } from 'next/server';
import { mockDb } from '@/app/libs/mock-db';

export async function GET() {
  try {
    const data = mockDb.sms_template_category.findMany();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
