import { mockDb } from '@/app/libs/mock-db';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { checkIncomingId } from '@/app/libs/checkIncomingIds';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(54);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const taskSettingsId = parseInt(params.id);

  const formData = await request.formData();

  const taskSettingsSchema = z.object({
    first: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    second: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    third: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  });

  const validatedData = taskSettingsSchema.safeParse({
    first: formData.get('first'),
    second: formData.get('second'),
    third: formData.get('third'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { first, second, third } = validatedData.data;

  try {
    const data = mockDb.task_settings.update({
      where: {
        id: taskSettingsId,
      },
      data: {
        first_span_limit_id: checkIncomingId(first),
        second_span_limit_id: checkIncomingId(second),
        third_span_limit_id: checkIncomingId(third),
      },
    });

    return NextResponse.json({ successMessage: 'Settings Successfully Updated' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
