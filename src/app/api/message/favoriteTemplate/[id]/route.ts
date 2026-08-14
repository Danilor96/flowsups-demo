import { checkPermissions } from '@/app/libs/auth-helpers';
import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(52);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const templateId = parseInt(params.id);

  const formData = await request.formData();

  const smsTemplateSchema = z.object({
    favorite: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = smsTemplateSchema.safeParse({
    favorite: formData.get('favorite'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { favorite } = validatedData.data;

  try {
    const currentData = mockDb.sms_template.findUnique({
      where: {
        id: templateId,
      },
    });

    const returnValue = (data?: boolean) => {
      if (data === null) return false;

      if (data) return false;

      return true;
    };

    mockDb.sms_template.update({
      where: {
        id: templateId,
      },
      data: {
        favorite: returnValue(currentData?.favorite),
      },
    });

    return NextResponse.json({ successMessage: 'Templates Updated' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
