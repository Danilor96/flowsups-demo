import { NextResponse } from 'next/server';
import { z } from 'zod';
import { mockDb } from '@/app/libs/mock-db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const appointmentId = params.id;

  const data = await request.formData();

  const dayAppSchema = z.object({
    action: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = dayAppSchema.safeParse({
    action: data.get('action'),
  });

  if (!validatedData.success) {
    return NextResponse.json(validatedData.error.flatten().fieldErrors, { status: 422 });
  }

  const { action } = validatedData.data;

  try {
    const data = await mockDb.appointments.update({
      where: {
        id: parseInt(appointmentId),
      },
      data: {
        status_id: parseInt(action),
      },
    });

    return NextResponse.json({ successMessage: 'Status Successfully Changed' }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
