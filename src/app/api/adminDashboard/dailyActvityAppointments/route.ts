import prisma from '@/app/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { Roles } from '../dailyCalls/types';
import { getEndOfDay, getStartOfDay } from '@/app/libs/buildDatePrismaFilter';

export async function GET(request: NextRequest) {
  const session = await auth();
  const userRoleId = session?.user.user_has[0]?.role_id;
  const userId = session?.user.id;
  const { searchParams } = request.nextUrl;
  const timeZone = searchParams.get('timezone') || 'America/Chicago';

  const now = new Date();
  const startOfTodayUTC = getStartOfDay(now, timeZone);
  const endOfTodayUTC = getEndOfDay(now, timeZone);

  try {
    const adminRoles = [Roles.Superuser, Roles.Administrator, Roles.SalesManager, Roles.FinanceManager];

    const data = await prisma.appointments.findMany({
      where: {
        start_date: {
          gte: startOfTodayUTC,
          lte: endOfTodayUTC,
        },
        OR: [
          {
            status_id: 5,
          },
          {
            status_id: 1,
          },
          {
            status_id: 6,
          },
          {
            status_id: 2,
          },
        ],
        ...(userRoleId && !adminRoles.includes(userRoleId)
          ? {
              OR: [
                {
                  created_by: userId,
                },
                {
                  user_id: userId,
                },
              ],
            }
          : null),
        // AND: {
        //   customers: {
        //     client_status_id: {
        //       not: 10,
        //     },
        //   },
        // },
      },
      include: {
        customers: {
          select: {
            first_name: true,
            last_name: true,
            mobile_phone: true,
            appointment_confirmation_sms_sent: true,
            email: true,
            id: true,
            client_status_id: true,
            interested_vehicle: {
              select: {
                id: true,
                vehicle_brands: true,
                vehicle_models: true,
                vehicle_manufacture_years: true,
                vehicle_identification_numbers: true,
              },
            },
            bdc: {
              select: {
                name: true,
                last_name: true,
              },
            },
            finance_manager: {
              select: {
                name: true,
                last_name: true,
              },
            },
            sales_manager: {
              select: {
                name: true,
                last_name: true,
              },
            },
            daily_visit_history: {
              select: {
                id: true,
                decision: true,
              },
            },
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            last_name: true,
          },
        },
      },
      orderBy: {
        start_date: 'asc',
      },
    });

    //await prisma.$disconnect();

    console.log(data);

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
