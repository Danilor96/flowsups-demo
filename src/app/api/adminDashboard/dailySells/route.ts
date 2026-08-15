import { mockDb } from '@/app/libs/mock-db';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const timeZone = searchParams.get('timeZone') || 'America/Chicago';

    const now = new Date();
    const startOfTodayUTC = getStartOfDay(now, timeZone);
    const endOfTodayUTC = getEndOfDay(now, timeZone);

    const data = mockDb.leads.findMany({
      where: {
        customer_status_id: 10, // Sold
        sold_created_at: {
          gte: startOfTodayUTC,
          lte: endOfTodayUTC,
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