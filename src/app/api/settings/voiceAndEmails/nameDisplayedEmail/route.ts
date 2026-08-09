import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prisma';

export async function GET() {
  try {
    const data = await prisma.email_name_displayed.findMany();

    //await prisma.$disconnect();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
