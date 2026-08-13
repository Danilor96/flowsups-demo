import { mockDb } from '@/app/libs/mock-db';
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
    const foundClient = mockDb.clients.findUnique({
      where: {
        id: customerId,
      },
    });

    const prevData = foundClient
      ? {
          bdc_id: foundClient.bdc_id,
          seller_id: foundClient.seller_id,
          finance_manager_id: foundClient.finance_manager_id,
          sales_manager_id: foundClient.sales_manager_id,
          first_name: foundClient.first_name,
          last_name: foundClient.last_name,
        }
      : null;

    const index = parseInt(userTypeIndex);
    const id = parseInt(userId);

    const data = mockDb.clients.update({
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

    const relatedUser = mockDb.users_has_customers.create({
      data: {
        customer_id: customerId,
        user_id: id,
      },
    });

    if (leadId) {
      const foundLead = mockDb.leads.findUnique({
        where: {
          id: Number(leadId),
        },
      });

      const currentData = foundLead
        ? {
            bdc_id: foundLead.bdc_id,
            sales_manager_id: foundLead.sales_manager_id,
            sales_rep_id: foundLead.sales_rep_id,
            finance_manager_id: foundLead.finance_manager_id,
          }
        : null;

      mockDb.leads.update({
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
      const appointment = mockDb.appointments.update({
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

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
