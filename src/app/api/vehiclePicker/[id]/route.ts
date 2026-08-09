import prisma from '@/app/libs/prisma';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(68);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const customerId = parseInt(params.id);

  const formData = await request.formData();

  const vehicleSchema = z.object({
    vehicleId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    leadId: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  });

  const validatedValue = vehicleSchema.safeParse({
    vehicleId: formData.get('vehicleId'),
    leadId: formData.get('leadId'),
  });

  if (!validatedValue.success) {
    return NextResponse.json(
      { fieldErrors: validatedValue.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { vehicleId, leadId } = validatedValue.data;

  try {
    const data = await prisma.clients.update({
      where: {
        id: customerId,
      },
      data: {
        intereseted_vehicle_id: parseInt(vehicleId),
      },
    });

    if (leadId) {
      await prisma.leads.update({
        where: { id: Number(leadId) },
        data: {
          vehicle_id: parseInt(vehicleId),
        },
      });
    }

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Vehicle Successfully Changed' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
