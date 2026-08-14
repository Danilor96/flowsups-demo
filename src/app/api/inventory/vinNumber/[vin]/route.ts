import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { vin: string } }) {
  const vin = params.vin;

  try {
    const data = mockDb.vehicle_identification_numbers.findUnique({
      where: {
        vin,
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
