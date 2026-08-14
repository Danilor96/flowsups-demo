import { mockDb } from '@/app/libs/mock-db';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const referrerId = parseInt(params.id);

  const formData = await request.formData();

  const amountSchema = z.object({
    amount: z.string({ invalid_type_error: 'Please enter a value' }).nullable(),
  });

  const validatedData = amountSchema.safeParse({
    amount: formData.get('amount'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { amount } = validatedData.data;

  try {
    const data = mockDb.clients_has_referrer.update({
      where: {
        id: referrerId,
      },
      data: {
        amount: amount,
      },
    });

    return NextResponse.json({ successMessage: 'Amount Successfully Updated' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
