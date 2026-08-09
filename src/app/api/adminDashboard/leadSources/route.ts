import prisma from '@/app/libs/prisma';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

// get all lead sources logic

export async function GET() {
  try {
    const data = await prisma?.lead_sources.findMany();

    //await prisma?.$disconnect();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
