import prisma from '@/app/libs/prisma';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const now = new Date().setHours(0, 0, 0);
    const nowLate = new Date().setHours(23, 59, 59);

    const data = await prisma.appointments.count({
      where: {
        start_date: {
          gte: new Date(now),
          lte: new Date(nowLate),
        },
      },
    });

    //await prisma.$disconnect();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
