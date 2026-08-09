import { checkPermissions } from '@/app/libs/auth-helpers';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(51);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const templateId = parseInt(params.id);

  const formData = await request.formData();

  const emailTemplateSchema = z.object({
    favorite: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = emailTemplateSchema.safeParse({
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
    const currentData = await prisma.email_template.findUnique({
      where: {
        id: templateId,
      },
      select: {
        favorite: true,
      },
    });

    const returnValue = (data?: boolean) => {
      if (data === null) return false;

      if (data) return false;

      return true;
    };

    const data = await prisma.email_template.update({
      where: {
        id: templateId,
      },
      data: {
        favorite: returnValue(currentData?.favorite),
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Templates Updated' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
