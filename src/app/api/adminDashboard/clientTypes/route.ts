import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';

// get all client types logic

export async function GET() {
  try {
    const data = await prisma?.client_types.findMany();

    //await prisma?.$disconnect();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
