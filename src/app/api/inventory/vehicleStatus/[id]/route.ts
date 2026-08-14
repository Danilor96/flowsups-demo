import { mockDb } from '@/app/libs/mock-db';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(24);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const vehicleId = parseInt(params.id);

  const formData = await request.formData();

  const dataSchema = z.object({
    statusId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = dataSchema.safeParse({
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
    const data = mockDb.vehicles.update({
      where: {
        id: vehicleId,
      },
      data: {
        vehicle_status_id: parseInt(statusId),
      },
    });

    return NextResponse.json({ successMessage: 'Status Successfully Changed' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
