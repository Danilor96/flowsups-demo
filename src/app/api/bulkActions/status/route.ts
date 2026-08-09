import prisma from '@/app/libs/prisma';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createEvent } from '@/app/libs/events/events';
import { auth } from '@/auth';
import { checkPermissions } from '@/app/libs/auth-helpers';
import { customerStatusName } from '@/app/libs/customer/customersFunctions';

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions(61);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const session = await auth();

  const userId = session?.user.id;

  const statusSchema = z
    .object({
      customersArray: z
        .array(z.number({ invalid_type_error: 'Please enter a valid value' }))
        .min(1, 'Please select a customer'),
      status: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
    })
    .refine((data) => data.customersArray.length > 0, {
      message: 'Please select a customer',
      path: ['status'],
    });

  const arrayData = formData.get('customers');

  const validatedData = statusSchema.safeParse({
    customersArray: typeof arrayData === 'string' && JSON.parse(arrayData),
    status: formData.get('status'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { customersArray, status } = validatedData.data;

  try {
    const prevStatus = await prisma.clients.findMany({
      where: {
        id: { in: customersArray },
      },
      select: {
        id: true,
        client_status: true,
      },
    });

    const customerUpdate = prisma.clients.updateMany({
      where: {
        id: {
          in: customersArray,
        },
      },
      data: {
        client_status_id: Number(status),
      },
    });

    const leadUpdate = prisma.leads.updateMany({
      where: {
        is_active: true,
        customer_id: {
          in: customersArray,
        },
      },
      data: {
        customer_status_id: Number(status),
      },
    });

    await Promise.all([customerUpdate, leadUpdate]);

    for (let i = 0; i < prevStatus.length; i++) {
      const el = prevStatus[i];

      const description = `Status changed from bulk actions. \n Prev status: ${
        el.client_status?.status || ''
      }. \n New status: ${customerStatusName[Number(status)] || ''}.`;

      if (userId) await createEvent(description, userId, el.id, new Date());
    }

    return NextResponse.json({ successMessage: 'Status Successfully Changed' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
