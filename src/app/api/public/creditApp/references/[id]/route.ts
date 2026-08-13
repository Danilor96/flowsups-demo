import { mockDb } from '@/app/libs/mock-db';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createNotification } from '@/app/libs/notifications/notifications';
import { createEvent } from '@/app/libs/events/events';
import { io } from 'socket.io-client';

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:3001';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  const formData = await request.formData();

  const referencesSchema = z.object({
    otherIncomeId: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    incomeAmount: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    incomeSource: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    references: z.array(
      z.object({
        id: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
        name: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
        address: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
        phoneNumber: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
        relationship: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      }),
    ),
    modifiedDate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please, enter value'),
  });

  const data = formData.get('references');

  const validatedData = referencesSchema.safeParse({
    otherIncomeId: formData.get('otherIncomeId'),
    incomeAmount: formData.get('incomeAmount'),
    incomeSource: formData.get('incomeSource'),
    references: typeof data === 'string' && JSON.parse(data),
    modifiedDate: formData.get('modifiedDate'),
  });

  if (!validatedData.success) {
    const errors = validatedData.error.formErrors.fieldErrors;

    const formattedErrors = validatedData.error.errors.reduce<Record<string, string>>(
      (acc, error) => {
        const path = error.path.join('.');
        acc[path] = error.message;
        return acc;
      },
      {},
    );

    return NextResponse.json({ fieldErrors: formattedErrors }, { status: 422 });
  }

  const { incomeAmount, incomeSource, otherIncomeId, references, modifiedDate } =
    validatedData.data;

  try {
    const formsCopy = [...references];
    const formsIds = formsCopy.map((el) => (el.id ? parseInt(el.id) : undefined));

    await deletePreviousReferenceData(formsIds);

    for (let i = 0; i < references.length; i++) {
      const el = references[i];

      if (!el.address || !el.name || !el.phoneNumber || !el.relationship) break;

      const updatedData = mockDb.credit_app_reference.upsert({
        where: { id: el.id ? parseInt(el.id) : 0 },
        update: {
          address: el.address,
          customer_id: customerId,
          name: el.name,
          phone_number: el.phoneNumber,
          relationship_id: parseInt(el.relationship),
        },
        create: {
          address: el.address,
          customer_id: customerId,
          name: el.name,
          phone_number: el.phoneNumber,
          relationship_id: parseInt(el.relationship),
        },
      });
    }

    if (incomeAmount && incomeAmount !== '0' && incomeSource && incomeSource !== '0') {
      mockDb.credit_app_other_income.upsert({
        where: { id: otherIncomeId ? parseInt(otherIncomeId) : 0 },
        update: {
          customer_id: customerId,
          income_amount: incomeAmount,
          income_source: incomeSource,
        },
        create: {
          customer_id: customerId,
          income_amount: incomeAmount,
          income_source: incomeSource,
        },
      });
    }

    const customerData = mockDb.clients.findFirst({
      where: {
        id: customerId,
      },
    });

    const message = `There is a new completed credit app for customer ${customerData?.first_name} ${customerData?.last_name}`;
    //
    await createNotification({
      message: message,
      notificationType: {
        general: true,
      },
      assignedToId: customerData?.seller_id,
      notificationsForManagers: true,
      eventTypeId: 9,
    });

        mockDb.clients.update({
      where: {
        id: customerData?.id,
      },
      data: {
        credit_app_forms_completed: true,
        client_status_id: 3,
        client_status_changed_at: new Date().toISOString(),
        credit_app_list_status_id: 1,
      },
    });

    const activeLead = mockDb.leads.findFirst({
      where: {
        customer_id: customerId,
        is_active: true,
      },
    });

    if (activeLead && activeLead.id) {
      const lead = mockDb.leads.update({
        where: {
          id: activeLead.id,
          customer_id: customerId,
          is_active: true,
        },
        data: {
          customer_status_id: 3,
          customer_credit_app_list_status_id: 1,
        },
      });
    }

    const description = 'Credit app completed';

    await createEvent(description, undefined, customerId);

    mockDb.credit_app_code.delete({
      where: {
        customer_id: customerId,
      },
    });

    const socket = io(socketUrl);

    socket?.emit('ask_for_update_data', 'creditApp', false, '', {
      customerId,
      employmentStatus: true,
    });

    socket?.emit('ask_for_update_data', 'dailyTotals');

    socket?.disconnect();

    return NextResponse.json({ successMessage: 'Data Successfully Saved' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

const deletePreviousReferenceData = async (formId: (number | null | undefined)[]) => {
  try {
    if (formId && formId.length > 0) {
      const previousForms = mockDb.credit_app_reference.findMany();

      if (formId.length < previousForms.length) {
        const formsToDelete = previousForms.filter((form) => !formId.includes(form.id));

        if (formsToDelete.length > 0) {
          const formsIds = formsToDelete.map((form) => form.id);

          mockDb.credit_app_reference.deleteMany({
            where: {
              id: {
                in: formsIds,
              },
            },
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
