import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prisma';

export async function GET(request: Request, { params }: { params: { vin: string } }) {
  const vin = params.vin;

  try {
    const data = await prisma.vehicle_identification_numbers.findUnique({
      where: {
        vin,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
