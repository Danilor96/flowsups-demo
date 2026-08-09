import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';

// get all vehicle mileages logic

export async function GET() {
  try {
    const data = await prisma?.vehicle_mileages.findMany();

    //await prisma?.$disconnect();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
