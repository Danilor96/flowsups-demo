import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const data = await prisma.consent_terms.findFirst();

    //await prisma.$disconnect();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
