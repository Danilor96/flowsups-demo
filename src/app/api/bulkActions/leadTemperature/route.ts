import prisma from '@/app/libs/prisma';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createEvent } from '@/app/libs/events/events';
import { auth } from '@/auth';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions(62);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const session = await auth();

  const userId = session?.user.id;

  const leadTemperatureSchema = z
    .object({
      customersArray: z
        .array(z.number({ invalid_type_error: 'Please enter a valid value' }))
        .min(1, 'Please select a customer'),
      temperature: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
    })
    .refine((data) => data.customersArray.length > 0, {
      message: 'Please select a customer',
      path: ['temperature'],
    });

  const arrayData = formData.get('customers');

  const validatedData = leadTemperatureSchema.safeParse({
    customersArray: typeof arrayData === 'string' && JSON.parse(arrayData),
    temperature: formData.get('temperature'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { customersArray, temperature } = validatedData.data;

  try {
    for (let i = 0; i < customersArray.length; i++) {
      const customerId = customersArray[i];

      const prevTemperature = await prisma.clients.findUnique({
        where: {
          id: customerId,
        },
        select: {
          client_lead_temperature: true,
        },
      });

      const data = await prisma.clients.update({
        where: {
          id: customerId,
        },
        data: {
          lead_temperature_id: parseInt(temperature),
        },
        select: {
          client_lead_temperature: true,
        },
      });

      const description = `Lead Temperature changed from bulk actions. \n Prev lead temperature: ${
        prevTemperature?.client_lead_temperature?.temperature || 'no established'
      }. \n New lead temperature: ${data.client_lead_temperature?.temperature || ''}.`;

      if (userId) await createEvent(description, userId, customerId, new Date());
    }

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Leads Successfully Changed' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
