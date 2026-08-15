import { mockDb } from '@/app/libs/mock-db';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

// get all lead sources logic

export async function GET() {
  try {
    const data = await mockDb.lead_sources.findMany();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
