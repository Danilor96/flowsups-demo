import { mockDb } from '@/app/libs/mock-db';
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

    const data = await mockDb.appointments.findMany({
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
      orderBy: {
        start_date: 'asc',
      },
    });

    console.log(data);

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
