import { buildDateRangeFilter } from '@/app/libs/monthAndYearDateFilter';
import prisma from '@/app/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    const prismaDateFilter = buildDateRangeFilter(startDate, endDate);
    // todo: multi tenant business id
    const businessId = await prisma.business.findFirst({ select: { id: true } });
    const result = await prisma.charges_back.findMany({
      where: {
        business_id: businessId?.id,
        created_at: prismaDateFilter,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const appointmentSchema = z.object({
    description: z.string({ invalid_type_error: 'Please enter a valid value' }).min(1, 'Please enter a value'),
    amount: z.string({ invalid_type_error: 'Please enter a valid value' }).min(1, 'Please enter a value'),
  });

  const validatedData = appointmentSchema.safeParse({
    description: formData.get('description'),
    amount: formData.get('amount'),
  });

  if (!validatedData.success) {
    return NextResponse.json({ fieldErrors: validatedData.error.flatten().fieldErrors }, { status: 422 });
  }

  const { description, amount } = validatedData.data;

  try {
    // todo: multi tenant business id
    const businessId = await prisma.business.findFirst({ select: { id: true } });
    if(!businessId) {
      return NextResponse.json({ serverError: 'Business not found' }, { status: 404 });
    }

    const result = await prisma.charges_back.create({
      data: {
        business_id: businessId.id,
        description,
        amount
      },
    });

    return NextResponse.json({ result, successMessage: 'Charge saved successfully' }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
