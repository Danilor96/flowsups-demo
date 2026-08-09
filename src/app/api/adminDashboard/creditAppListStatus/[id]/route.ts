import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  const formData = await request.formData();

  const creditListSchema = z.object({
    status_id: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = creditListSchema.safeParse({
    status_id: formData.get('status_id'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { status_id } = validatedData.data;

  try {
    const data = await prisma.clients.update({
      where: {
        id: customerId,
      },
      data: {
        credit_app_list_status_id: parseInt(status_id),
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Status successfully changed' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
