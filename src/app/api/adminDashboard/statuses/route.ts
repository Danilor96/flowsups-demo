import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';

// get all appointments statuses logic

export async function GET() {
  try {
    const data = await prisma?.appointments_status.findMany();

    //await prisma?.$disconnect();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
