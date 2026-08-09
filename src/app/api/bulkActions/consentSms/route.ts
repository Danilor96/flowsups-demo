import prisma from '@/app/libs/prisma';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createEvent } from '@/app/libs/events/events';
import { auth } from '@/auth';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions(63);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const session = await auth();

  const userId = session?.user.id;

  const consentSmsSchema = z
    .object({
      customersArray: z
        .array(z.number({ invalid_type_error: 'Please enter a valid value' }))
        .min(1, 'Please select a customer'),
      on: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      off: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    })
    .refine((data) => data.customersArray.length > 0, {
      message: 'Please select a customer',
      path: ['on'],
    })
    .refine((data) => data.on || data.off, {
      message: 'Please enter a value',
      path: ['on'],
    })
    .refine((data) => data.on || data.off, {
      message: 'Please enter a value',
      path: ['off'],
    });

  const arrayData = formData.get('customers');

  const validatedData = consentSmsSchema.safeParse({
    customersArray: typeof arrayData === 'string' && JSON.parse(arrayData),
    on: formData.get('on'),
    off: formData.get('off'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { customersArray, on, off } = validatedData.data;

  try {
    for (let i = 0; i < customersArray.length; i++) {
      const customerId = customersArray[i];

      const data = await prisma.clients.update({
        where: {
          id: customerId,
        },
        data: {
          consent_approved: on ? true : false,
        },
        select: {
          consent_approved: true,
        },
      });

      const description = `Consent Sms changed from bulk actions. \n Consent to send Sms set to: ${
        data.consent_approved ? 'True' : 'False'
      }.`;

      if (userId) await createEvent(description, userId, customerId, new Date());
    }

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Consent Successfully Changed' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
