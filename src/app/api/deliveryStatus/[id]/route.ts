import { NextResponse } from 'next/server';
import { z } from 'zod';
import { mockDb } from '@/app/libs/mock-db';

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
    mockDb.clients.update({
      where: {
        id: customerId,
      },
      data: {
        client_status_id: parseInt(statusId),
      },
    });

    const activeLead = mockDb.leads.findFirst({
      where: {
        customer_id: customerId,
        is_active: true,
        has_ended: false,
      },
    });

    if (activeLead && activeLead.id) {
      mockDb.leads.update({
        where: {
          id: activeLead.id,
        },
        data: {
          customer_status_id: parseInt(statusId),
          has_ended: statusId === '10',
        },
      });
    }

    return NextResponse.json({ successMessage: 'Customer Updated Successfully' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}