import { mockDb } from '@/app/libs/mock-db';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = mockDb.custom_be_back_reasons.findMany();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const customBeBackReasonsSchema = z.object({
    customBeBackReasons: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = customBeBackReasonsSchema.safeParse({
    customBeBackReasons: formData.get('customBeBackReasons'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { customBeBackReasons } = validatedData.data;

  try {
    const data = mockDb.custom_be_back_reasons.create({
      data: {
        reason: customBeBackReasons,
      },
    });

    return NextResponse.json({ successMessage: 'Reason Successfully Created' }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
