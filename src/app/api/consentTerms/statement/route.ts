import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const data = mockDb.consent_terms.findFirst();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
