import prisma from '@/app/libs/prisma';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createNotification } from '@/app/libs/notifications/notifications';
import { createEvent, trackChanges } from '@/app/libs/events/events';
import { auth } from '@/auth';
import { References, ReferencesData } from '../../types';
import { Credit_app_other_income, Credit_app_reference } from '@prisma/client';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  const formData = await request.formData();

  const session = await auth();

  const userId = session?.user.id;

  const referencesSchema = z.object({
    otherIncomeId: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    incomeAmount: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    incomeSource: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    references: z.array(
      z.object({
        id: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
        name: z
          .string({ invalid_type_error: 'Please enter a valid value' })
          .min(1, 'Please, enter value'),
        address: z
          .string({ invalid_type_error: 'Please enter a valid value' })
          .min(1, 'Please, enter value'),
        phoneNumber: z
          .string({ invalid_type_error: 'Please enter a valid value' })
          .min(1, 'Please, enter value'),
        relationship: z
          .string({ invalid_type_error: 'Please enter a valid value' })
          .min(1, 'Please, enter value'),
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

    let referencesData: Credit_app_reference[] = [];

    for (let i = 0; i < references.length; i++) {
      const el = references[i];

      const prevData = await prisma.credit_app_reference.findUnique({
        where: {
          id: el.id ? parseInt(el.id) : 0,
        },
      });

      const updatedData = await prisma.credit_app_reference.upsert({
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

      referencesData.push(updatedData);

      const worksWith = ['address', 'customer_id', 'name', 'phone_number', 'relationship_id'];

      const updatedFields = await trackChanges({
        prevData,
        updatedData,
        worksWith,
      });

      if (updatedFields.length > 0 && userId) {
        const description = `Fields at Credit App References modified: ${updatedFields.join(', ')}`;

        await createEvent(description, userId, customerId, new Date(modifiedDate));
      }
    }

    const otherIncomeUpdated = await prisma.credit_app_other_income.upsert({
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

    const customerData = await prisma.clients.findFirst({
      where: {
        id: customerId,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        seller_id: true,
        credit_app_forms_completed: true,
      },
    });

    if (customerData && !customerData.credit_app_forms_completed) {
      const message = `There is a new completed credit app for customer ${customerData?.first_name} ${customerData?.last_name}`;

      await createNotification({
        message: message,
        notificationType: {
          general: true,
        },
        assignedToId: customerData?.seller_id,
        notificationsForManagers: true,
        eventTypeId: 9,
      });

      await prisma.clients.update({
        where: {
          id: customerData?.id,
        },
        data: {
          credit_app_forms_completed: true,
        },
      });

      const description = 'Credit app completed';

      await createEvent(description, userId, customerId);
    }

    const data = await prisma.customer_employment.findMany({
      where: {
        client_id: customerId,
      },
      include: {
        customer_employment_address: true,
      },
    });

    const dataToReturn: ReferencesData = {
      id: otherIncomeUpdated.id,
      otherIncomeAmount: otherIncomeUpdated.income_amount,
      otherIncomeSource: otherIncomeUpdated.income_source,
      references: referencesData.map((el) => ({
        id: el.id,
        address: el.address,
        name: el.name,
        phoneNumber: el.phone_number,
        relationship: el.relationship_id,
      })),
    };

    return NextResponse.json({ successMessage: 'Data Successfully Saved', data: dataToReturn });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

const deletePreviousReferenceData = async (formId: (number | null | undefined)[]) => {
  try {
    if (formId && formId.length > 0) {
      const previousForms = await prisma.credit_app_reference.findMany();

      if (formId.length < previousForms.length) {
        const formsToDelete = previousForms.filter((form) => !formId.includes(form.id));

        if (formsToDelete.length > 0) {
          const formsIds = formsToDelete.map((form) => form.id);

          await prisma.credit_app_reference.deleteMany({
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

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  try {
    const data = await prisma.credit_app_reference.findMany({
      where: { customer_id: customerId },
      include: {
        customer: {
          select: {
            credit_app_other_income: true,
          },
        },
      },
    });

    //await prisma.$disconnect();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
