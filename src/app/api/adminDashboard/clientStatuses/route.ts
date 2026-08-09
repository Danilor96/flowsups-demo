import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await prisma?.client_status.findMany({
      select: {
        id: true,
        status: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    //await prisma?.$disconnect();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma?.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
