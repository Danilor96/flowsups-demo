import prisma from '@/app/libs/prisma';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function GET() {
  try {
    const data = await prisma.consent_checks.findMany();

    //await prisma.$disconnect();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const permissionsCheck = await checkPermissions(56);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const checksSchema = z.object({
    checks: z.array(
      z.object({
        id: z
          .number({ invalid_type_error: 'Please enter a valid value' })
          .min(1, 'Please enter a value'),
        description: z
          .string({ invalid_type_error: 'Please enter a valid value' })
          .min(1, 'Please enter a value'),
        required: z.boolean({ invalid_type_error: 'Please enter a valid value' }),
      }),
    ),
  });

  const arrayData = formData.get('checks');

  const validatedData = checksSchema.safeParse({
    checks: typeof arrayData === 'string' && JSON.parse(arrayData),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { checks } = validatedData.data;

  try {
    for (let i = 0; i < checks.length; i++) {
      const checkData = checks[i];

      await prisma.consent_checks.upsert({
        where: {
          id: checkData.id,
        },
        update: {
          description: checkData.description,
          required: checkData.required,
        },
        create: {
          description: checkData.description,
          required: checkData.required,
        },
      });
    }

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Data Successfully Updated' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
