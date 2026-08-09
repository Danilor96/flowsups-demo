import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prisma';
import { z } from 'zod';
import { NextRequest } from 'next/server';
import { buildDateRangeFilter } from '@/app/libs/monthAndYearDateFilter';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const prismaDateFilter = buildDateRangeFilter(startDate, endDate);
    const data = await prisma.other_sales_log.findMany({
      where: {
        created_at: prismaDateFilter,
      },
      include: {
        assigned_seller: true,
        vehicle: true
      }
    })

    return NextResponse.json({data: data});
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        serverError: 'Server Error',
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  // const permissionsCheck = await checkPermissions([75]);

  // if (permissionsCheck) {
  //   return permissionsCheck;
  // }

  const formData = await request.formData();

  const appointmentSchema = z.object({
    customer_firstname: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    customer_lastname: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    phone_number: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(10, 'Enter a valid phone number format')
        .max(10, 'Enter a valid phone number format'),
    seller_id: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    vehicle_make: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    vehicle_model: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    vehicle_year: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    stock_no: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    vin: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = appointmentSchema.safeParse({
    customer_firstname: formData.get('customer_firstname'),
    customer_lastname: formData.get('customer_lastname'),
    phone_number: formData.get('phone_number'),
    seller_id: formData.get('seller_id'),
    vehicle_make: formData.get('vehicle_make'),
    vehicle_model: formData.get('vehicle_model'),
    vehicle_year: formData.get('vehicle_year'),
    stock_no: formData.get('stock_no'),
    vin: formData.get('vin'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { customer_firstname, customer_lastname, phone_number, seller_id, vehicle_make, vehicle_model, vehicle_year, stock_no, vin } =
    validatedData.data;

  try {
    const vehicle = await prisma.other_vehicle.create({
      data: {
        make: vehicle_make,
        model: vehicle_model,
        year: vehicle_year,
        stock_no: stock_no,
        vin: vin,
      },
    });
    if (!vehicle) {
      return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
    }

    const data = await prisma.other_sales_log.create({
      data: {
        customerFirstName: customer_firstname,
        customerLastName: customer_lastname,
        customerMobile: phone_number,
        assigned_seller_id: parseInt(seller_id),
        created_at: new Date().toISOString(),
        date: new Date().toISOString(),
        vehicle_id: vehicle.id,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Sales Log (Other) Created' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
