import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const data = await prisma?.events.findMany({
      orderBy: {
        updated_at: 'desc',
      },
    });

    //await prisma?.$disconnect();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
