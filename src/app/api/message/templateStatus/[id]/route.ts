import { z } from 'zod';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(52);
  
    if (permissionsCheck) {
      return permissionsCheck;
    }

  const templateId = parseInt(params.id);

  const formData = await request.formData();

  const statusSchema = z.object({
    status: z.string({ invalid_type_error: 'Please enter a valid value' }),
  });

  const validatedData = statusSchema.safeParse({
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
    const data = await prisma.sms_template.update({
      where: {
        id: templateId,
      },
      data: {
        published: status === '1' ? true : false,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Status Changed Successfully' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
