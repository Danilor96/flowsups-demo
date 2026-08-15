import { mockDb } from '@/app/libs/mock-db';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { format } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';

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

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const timeZone = searchParams.get('timezone') || 'America/Chicago';
  const now = new Date();
  const startOfTodayUTC = getStartOfDay(now, timeZone);
  const endOfTodayUTC = getEndOfDay(now, timeZone);

  try {
    const dataFromLead = mockDb.leads.findMany({
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

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(dataFromLead);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Sever Error' }, { status: 500 });
  }
}
