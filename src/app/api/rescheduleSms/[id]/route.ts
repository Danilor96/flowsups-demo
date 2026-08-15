import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const smsId = parseInt(params.id);

  const formData = await request.formData();

  const smsSchema = z.object({
    sms: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = smsSchema.safeParse({
    sms: formData.get('sms'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { sms } = validatedData.data;

  try {
    const data = mockDb.rescheduleSms.update({
      where: {
        id: smsId,
      },
      data: {
        sms: sms,
      },
    });


    return NextResponse.json({ successMessage: 'Sms Successfully Saved' });
  } catch (error) {
    console.log(error);


    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
