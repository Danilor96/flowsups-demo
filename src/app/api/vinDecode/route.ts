import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  await request.formData();

  try {
    const data = {
      status: 1,
      decode: [
        { label: 'Model Year', value: '2020' },
        { label: 'Make', value: 'TOYOTA' },
        { label: 'Model', value: 'CAMRY' },
        { label: 'Trim', value: 'SE' },
        { label: 'Body', value: 'Sedan' },
        { label: 'Engine Displacement (ccm)', value: '2487' },
        { label: 'Engine Cylinders', value: '4' },
        { label: 'Drive', value: 'Front-wheel drive' },
        { label: 'Number of Doors', value: '4' },
        { label: 'Fuel Type - Primary', value: 'Gasoline' },
      ],
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}