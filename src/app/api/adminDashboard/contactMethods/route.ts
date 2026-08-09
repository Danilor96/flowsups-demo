import prisma from '@/app/libs/prisma';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

// get all contact methods logic

export async function GET() {
  try {
    const data = await prisma?.contact_methods.findMany();

    //await prisma?.$disconnect();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
