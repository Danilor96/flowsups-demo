import { mockDb } from '@/app/libs/mock-db';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(51);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const templateId = parseInt(params.id);

  const formData = await request.formData();

  const templatePublishSchema = z.object({
    status: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = templatePublishSchema.safeParse({
    status: formData.get('status'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { status } = validatedData.data;

  try {
    const data = mockDb.email_template.update({
      where: {
        id: templateId,
      },
      data: {
        published: status === '1' ? true : false,
      },
    });

    return NextResponse.json({ successMessage: 'Publish Status Changed Successfully' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
