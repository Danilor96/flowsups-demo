import { mockDb } from '@/app/libs/mock-db';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = mockDb.unknown_adf_elements.findMany();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const unknownAdfElementSchema = z.object({
    unknownAdfElement: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = unknownAdfElementSchema.safeParse({
    unknownAdfElement: formData.get('unknownAdfElement'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { unknownAdfElement } = validatedData.data;

  try {
    const data = mockDb.unknown_adf_elements.create({
      data: {
        element: unknownAdfElement,
      },
    });

    return NextResponse.json({ successMessage: 'Element Successfully Created' }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
