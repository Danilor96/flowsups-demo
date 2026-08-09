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

  const businessVehicleUrlSchema = z.object({
    vehicleDetailPageUrl: z
      .string({ invalid_type_error: 'Please, enter a valid data' })
      .startsWith('https://', 'A website must start with a valid secure URL format')
      .min(18, 'Please, enter at least 18 character including all URL format'),
  });

  const validatedData = businessVehicleUrlSchema.safeParse({
    vehicleDetailPageUrl: formData.get('vehicleDetailPageUrl'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { vehicleDetailPageUrl } = validatedData.data;

  try {
    const data = await prisma.business_vehicle_detail_page_url.create({
      data: {
        url: vehicleDetailPageUrl,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Page Url Successfully Saved' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await prisma.business_vehicle_detail_page_url.findMany();

    //await prisma.$disconnect();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
