import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  const formData = await request.formData();

  const deliveryStatusSchema = z.object({
    statusId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = deliveryStatusSchema.safeParse({
    statusId: formData.get('statusId'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { statusId } = validatedData.data;

  try {
    const data = await prisma.clients.update({
      where: {
        id: customerId,
      },
      data: {
        client_status_id: parseInt(statusId),
      },
    });

    const activeLead = await prisma.leads.findFirst({
      where: {
        customer_id: customerId,
        is_active: true,
        has_ended: false,
      },
      select: {
        id: true,
      },
    });

    if (activeLead && activeLead.id) {
      const lead = await prisma.leads.update({
        where: {
          id: activeLead.id,
          customer_id: customerId,
          is_active: true,
        },
        data: {
          customer_status_id: parseInt(statusId),
          has_ended: statusId === '10',
        },
      });
    }

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Customer Updated Successfully' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
