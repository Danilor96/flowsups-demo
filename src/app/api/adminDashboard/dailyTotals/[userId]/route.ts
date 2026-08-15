import { mockDb } from '@/app/libs/mock-db';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { Roles } from '../../dailyCalls/types';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';
import { format } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

const getStartOfDay = (date: Date | string, timeZone: string): Date => {
  let datePart: string;

  if (date instanceof Date) {
    datePart = format(toZonedTime(date, timeZone), 'yyyy-MM-dd');
  } else {
    datePart = date.includes('T') ? date.split('T')[0] : date;
  }

  return fromZonedTime(`${datePart} 00:00:00`, timeZone);
};

const getEndOfDay = (date: Date | string, timeZone: string): Date => {
  let datePart: string;

  if (date instanceof Date) {
    datePart = format(toZonedTime(date, timeZone), 'yyyy-MM-dd');
  } else {
    datePart = date.includes('T') ? date.split('T')[0] : date;
  }

  return fromZonedTime(`${datePart} 23:59:59.999`, timeZone);
};

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

    const dailyCallsCount = mockDb.client_calls.count({
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

    const dailyMessagesData = mockDb.client_sms.findMany({
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
    });

    let dailyMadeAppointmentCount = 0;

    if (userId) {
      dailyMadeAppointmentCount = mockDb.appointments.count({
        where: {
          created_at: {
            gte: startOfTodayUTC,
            lte: endOfTodayUTC,
          },
          created_by: hasPermissionToGetAll ? undefined : userId,
        },
      });
    }

    const userRole = mockDb.users.findUnique({
      where: {
        id: userId,
        deleted_at: null,
      },
    });

    let missingTasksCount = 0;

    if (userRole?.user_has[0].role_id) {
      if (seeAllCounts.includes(userRole.user_has[0].role_id)) {
        missingTasksCount = mockDb.tasks.count({
          where: {
            status: 4,
          },
        });
      } else {
        missingTasksCount = mockDb.tasks.count({
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
        dailySellsCount = mockDb.leads.count({
          where: {
            customer_status_id: CustomersStatuses.Sold, // Sold
            sold_created_at: {
              gte: startOfTodayUTC,
              lte: endOfTodayUTC,
            },
          },
        });
      } else {
        dailySellsCount = mockDb.leads.count({
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

    const dailyMadeCreditAppCount = mockDb.leads.count({
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

    dailyMessagesData.forEach((el: any) => {
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

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}