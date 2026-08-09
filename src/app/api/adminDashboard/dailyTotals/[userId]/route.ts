import prisma from '@/app/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { Roles } from '../../dailyCalls/types';
import { getStartOfDay, getEndOfDay } from '@/app/libs/buildDatePrismaFilter';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const userId = parseInt(params.userId);

  const { searchParams } = request.nextUrl;
  const timeZone = searchParams.get('timeZone') || 'America/Chicago';

  const now = new Date();
  const startOfTodayUTC = getStartOfDay(now, timeZone);
  const endOfTodayUTC = getEndOfDay(now, timeZone);
  const session = await auth();

  const roleId = session?.user.user_has[0].role_id;

  const hasPermissionToGetAll = roleId === Roles.Administrator || roleId === Roles.Superuser;

  try {
    const seeAllCounts = [1, 2];

    const dailyCallsCount = await prisma.client_calls.count({
      where: {
        call_date: {
          gte: startOfTodayUTC,
          lte: endOfTodayUTC,
        },
        user_id: hasPermissionToGetAll ? undefined : { has: userId },
        call_duration: {
          not: {
            equals: '0',
          },
        },
      },
    });

    const dailyMessagesData = await prisma.client_sms.findMany({
      where: {
        date_sent: {
          gte: startOfTodayUTC,
          lte: endOfTodayUTC,
        },
        is_consent_message: false,
        sent_by_user: true,
        user: hasPermissionToGetAll
          ? undefined
          : {
              every: {
                id: userId,
              },
            },
      },
      select: {
        client_id: true,
        unregistered_customer: {
          select: {
            id: true,
          },
        },
      },
    });

    let dailyMadeAppointmentCount = 0;

    if (userId) {
      dailyMadeAppointmentCount = await prisma.appointments.count({
        where: {
          created_at: {
            gte: startOfTodayUTC,
            lte: endOfTodayUTC,
          },
          created_by: hasPermissionToGetAll ? undefined : userId,
        },
      });
    }

    const userRole = await prisma.users.findUnique({
      where: {
        id: userId,
        deleted_at: null,
      },
      select: {
        user_has: {
          select: {
            role_id: true,
          },
        },
      },
    });

    let missingTasksCount = 0;

    if (userRole?.user_has[0].role_id) {
      if (seeAllCounts.includes(userRole.user_has[0].role_id)) {
        missingTasksCount = await prisma.tasks.count({
          where: {
            status: 4,
          },
        });
      } else {
        missingTasksCount = await prisma.tasks.count({
          where: {
            status: 4,
            assigned_to: userId,
          },
        });
      }
    }

    let dailySellsCount = 0;

    if (userRole?.user_has[0].role_id) {
      if (seeAllCounts.includes(userRole?.user_has[0].role_id)) {
        dailySellsCount = await prisma.leads.count({
          where: {
            customer_status_id: CustomersStatuses.Sold, // Sold
            sold_created_at: {
              gte: startOfTodayUTC,
              lte: endOfTodayUTC,
            },
          },
        });
      } else {
        dailySellsCount = await prisma.leads.count({
          where: {
            customer_status_id: CustomersStatuses.Sold,
            sold_created_at: {
              gte: startOfTodayUTC,
              lte: endOfTodayUTC,
            },
            sales_rep_id: userId,
          },
        });
      }
    }

    // const dailyMadeCreditAppCount = await prisma.credit_app.count({
    //   where: {
    //     created_at: {
    //       gte: startOfTodayUTC,
    //       lte: endOfTodayUTC,
    //     },
    //   },
    // });

    const dailyMadeCreditAppCount = await prisma.leads.count({
      where: {
        OR: [
          {
            credit_app_created_at: {
              gte: startOfTodayUTC,
              lte: endOfTodayUTC,
            },
          },
          {
            clients: {
              client_status_changed_at: {
                gte: startOfTodayUTC,
                lte: endOfTodayUTC,
              },
            },
            customer_status_id: CustomersStatuses.CreditApp,
          },
          {
            clients: {
              credit_app: {
                some: {
                  created_at: {
                    gte: startOfTodayUTC,
                    lte: endOfTodayUTC,
                  },
                },
              },
            },
          },
        ],
      },
    });

    let dailyMessagesCount = 0;
    const messagesArray: number[] = [];

    dailyMessagesData.forEach(el => {
      if (
        (el.client_id || el?.unregistered_customer[0]?.id) &&
        !messagesArray.includes(el.client_id || el.unregistered_customer[0]?.id)
      ) {
        dailyMessagesCount += 1;
        messagesArray.push(el.client_id || el.unregistered_customer[0]?.id);
      }
    });

    const data = {
      dailyCallsCount,
      dailyMessagesCount,
      dailyMadeAppointmentCount,
      missingTasksCount,
      dailyMadeCreditAppCount,
      dailySellsCount,
    };

    //await prisma.$disconnect();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
