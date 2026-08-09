import { checkPermissions } from '@/app/libs/auth-helpers';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions(46);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const websiteSchema = z.object({
    website: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .startsWith('https://', 'A website must start with a valid secure URL format')
      .min(18, 'Please, enter at least 18 character including all URL format'),
  });

  const validatedData = websiteSchema.safeParse({
    website: formData.get('website'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { website } = validatedData.data;

  try {
    const data = await prisma.business_websites.create({
      data: {
        website: website,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Website Successfully Saved' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await prisma.business_websites.findMany();

    //await prisma.$disconnect();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
