import prisma from '@/app/libs/prisma';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createEvent } from '@/app/libs/events/events';
import { auth } from '@/auth';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(69);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const customerId = parseInt(params.id);

  const session = await auth();

  const userSessionId = session?.user.id;

  const formData = await request.formData();

  const userPickerSchema = z.object({
    userId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    userTypeIndex: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    appId: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    leadId: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  });

  const validatedData = userPickerSchema.safeParse({
    userId: formData.get('userId'),
    userTypeIndex: formData.get('userType'),
    appId: formData.get('appId'),
    leadId: formData.get('leadId'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { userId, userTypeIndex, appId, leadId } = validatedData.data;

  try {
    const prevData = await prisma.clients.findUnique({
      where: {
        id: customerId,
      },
      select: {
        bdc_id: true,
        seller_id: true,
        finance_manager_id: true,
        sales_manager_id: true,
        first_name: true,
        last_name: true,
      },
    });

    const index = parseInt(userTypeIndex);
    const id = parseInt(userId);

    const data = await prisma.clients.update({
      where: {
        id: customerId,
      },
      data: {
        seller_id: index === 0 ? id : prevData?.seller_id,
        bdc_id: index === 1 ? id : prevData?.bdc_id,
        finance_manager_id: index === 2 ? id : prevData?.finance_manager_id,
        sales_manager_id: index === 3 ? id : prevData?.sales_manager_id,
      },
    });

    const relatedUser = await prisma.users_has_customers.create({
      data: {
        customer_id: customerId,
        user_id: id,
      },
    });

    if (leadId) {
      const currentData = await prisma.leads.findUnique({
        where: {
          id: Number(leadId),
        },
        select: {
          bdc_id: true,
          sales_manager_id: true,
          sales_rep_id: true,
          finance_manager_id: true,
        },
      });

      await prisma.leads.update({
        where: {
          id: Number(leadId),
        },
        data: {
          sales_rep_id: index === 0 ? id : currentData?.sales_rep_id,
          bdc_id: index === 1 ? id : currentData?.bdc_id,
          finance_manager_id: index === 2 ? id : currentData?.finance_manager_id,
          sales_manager_id: index === 3 ? id : currentData?.sales_manager_id,
        },
      });
    }

    if (appId && index === 0) {
      const appointment = await prisma.appointments.update({
        where: {
          id: parseInt(appId),
        },
        data: {
          user_id: id,
        },
      });
    }

    const usersTypesToResponde = ['Sales Rep', 'BDC', 'Finance Manager', 'Sales Manager'];

    const description = `${usersTypesToResponde[index]} changed`;

    await createEvent(description, userSessionId, customerId);

    return NextResponse.json({
      successMessage: `${usersTypesToResponde[index]} Successfully Updated`,
    });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
