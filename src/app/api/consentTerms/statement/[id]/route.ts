import prisma from '@/app/libs/prisma';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(56);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const statementId = parseInt(params.id);

  const formData = await request.formData();

  const statementSchema = z.object({
    description: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = statementSchema.safeParse({
    description: formData.get('description'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { description } = validatedData.data;

  try {
    const data = await prisma.consent_terms.update({
      where: {
        id: statementId,
      },
      data: {
        consent_statement: description,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Policy Statement Successfully Updated' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
