import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await prisma?.vehicles.findMany({
      select: {
        id: true,
        vehicle_manufacture_years: true,
        vehicle_brands: true,
        vehicle_models: true,
      }
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
