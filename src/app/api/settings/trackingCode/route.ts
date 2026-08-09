import prisma from '@/app/libs/prisma';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();

  const trackingCodeSchema = z.object({
    trackingCode: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = trackingCodeSchema.safeParse({
    trackingCode: formData.get('trackingCode'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { trackingCode } = validatedData.data;

  try {
    const data = await prisma.tracking_code.create({
      data: {
        code: trackingCode,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Code Successfully Created' }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
