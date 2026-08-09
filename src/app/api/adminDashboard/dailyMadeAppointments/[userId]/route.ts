import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { Roles } from '../../dailyCalls/types';
import { getEndOfDay, getStartOfDay } from '@/app/libs/buildDatePrismaFilter';

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const userId = params.userId;

  const session = await auth();

  const roleId = session?.user.user_has[0].role_id;

  const hasPermissionToGetAll = roleId === Roles.Administrator || roleId === Roles.Superuser;

  const { searchParams } = request.nextUrl;
  const timeZone = searchParams.get('timezone') || 'America/Chicago';
  const now = new Date();
  const startOfTodayUTC = getStartOfDay(now, timeZone);
  const endOfTodayUTC = getEndOfDay(now, timeZone);

  try {
    const data = await prisma.appointments.findMany({
      where: {
        created_at: {
          gte: startOfTodayUTC,
          lte: endOfTodayUTC,
        },
        AND: hasPermissionToGetAll
          ? undefined
          : {
              created_by: parseInt(userId),
            },
      },
      include: {
        customers: {
          select: {
            first_name: true,
            last_name: true,
            mobile_phone: true,
            home_phone: true,
            home_default: true,
            email: true,
            id: true,
            interested_vehicle: {
              select: {
                id: true,
                vehicle_brands: true,
                vehicle_models: true,
                vehicle_manufacture_years: true,
                vehicle_identification_numbers: true,
              },
            },
          },
        },
        users: {
          select: {
            name: true,
            last_name: true,
          },
        },
        appointments_status: {
          select: { status: true },
        }
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    //await prisma.$disconnect();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma?.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
