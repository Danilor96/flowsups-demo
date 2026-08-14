import { NextResponse } from 'next/server';
import { mockDb } from '@/app/libs/mock-db';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const data = mockDb.sms_template.findMany();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
