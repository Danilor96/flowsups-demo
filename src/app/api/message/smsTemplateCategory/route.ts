import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prisma';

export async function GET() {
  try {
    const data = await prisma.sms_template_category.findMany();

    //await prisma.$disconnect();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
