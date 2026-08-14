import { mockDb } from '@/app/libs/mock-db';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = mockDb.custom_no_sale_reasons.findMany();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const customNoSaleReasonsSchema = z.object({
    customNoSaleReasons: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = customNoSaleReasonsSchema.safeParse({
    customNoSaleReasons: formData.get('customNoSaleReasons'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { customNoSaleReasons } = validatedData.data;

  try {
    const data = mockDb.custom_no_sale_reasons.create({
      data: {
        reason: customNoSaleReasons,
      },
    });

    return NextResponse.json({ successMessage: 'Reason Successfully Created' }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
