import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';

// get all lead types logic

export async function GET() {
  try {
    const data = await prisma?.lead_types.findMany();

    //await prisma?.$disconnect();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
