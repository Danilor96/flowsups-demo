import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prisma';

export async function GET() {
  try {
    const data = await prisma.vehicle_conditions.findMany();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
