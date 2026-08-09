import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prisma';
import { z } from 'zod';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function GET() {
  try {
    const data = await prisma?.email_to_lead.findMany();

    prisma?.$disconnect();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions(54);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const emailToLeadSchema = z.object({
    forwardIncoming: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = emailToLeadSchema.safeParse({
    forwardIncoming: formData.get('forwardIncoming'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { forwardIncoming } = validatedData.data;

  try {
    const data = await prisma.email_to_lead.create({
      data: {
        lead: forwardIncoming,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Successfully Created' }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
