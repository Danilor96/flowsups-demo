import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await prisma?.client_id_type.findMany();

    //await prisma?.$disconnect();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
