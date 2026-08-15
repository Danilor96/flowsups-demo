import { mockDb } from '@/app/libs/mock-db';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const now = new Date().setHours(0, 0, 0);
    const nowLate = new Date().setHours(23, 59, 59);

    const data = mockDb.appointments.count({
      where: {
        start_date: {
          gte: new Date(now),
          lte: new Date(nowLate),
        },
      },
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}