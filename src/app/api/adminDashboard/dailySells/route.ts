import prisma from '@/app/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getStartOfDay, getEndOfDay } from '@/app/libs/buildDatePrismaFilter';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const timeZone = searchParams.get('timeZone') || 'America/Chicago';

    const now = new Date();
    const startOfTodayUTC = getStartOfDay(now, timeZone);
    const endOfTodayUTC = getEndOfDay(now, timeZone);

    const data = await prisma.leads.findMany({
      where: {
        customer_status_id: 10, // Sold
        sold_created_at: {
          gte: startOfTodayUTC,
          lte: endOfTodayUTC,
        },
      },
      select: {
        id: true,
        sold_created_at: true,
        vehicle: {
          select: {
            id: true,
            vehicle_brands: true,
            vehicle_models: true,
            vehicle_manufacture_years: true,
            vehicle_identification_numbers: true,
          },
        },
        sales_rep: {
          select: {
            id: true,
            name: true,
            last_name: true,
            username: true,
          },
        },
        clients: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            mobile_phone: true,
          },
        },
      },
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
