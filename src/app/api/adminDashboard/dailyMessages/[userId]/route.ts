import { DailyMessagesData } from '@/app/libs/definitions';
import { mockDb } from '@/app/libs/mock-db';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { Roles } from '../../dailyCalls/types';
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

  const session = await auth();

  const roleId = session?.user.user_has[0].role_id;

  const hasPermissionToGetAll = roleId === Roles.Administrator || roleId === Roles.Superuser;

  const { searchParams } = request.nextUrl;
  const timeZone = searchParams.get('timezone') || 'America/Chicago';
  const now = new Date();
  const startOfTodayUTC = getStartOfDay(now, timeZone);
  const endOfTodayUTC = getEndOfDay(now, timeZone);

  try {
    const data = mockDb.client_sms.findMany({
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
      orderBy: {
        date_sent: 'desc',
      },
    });

    let newCustomerMessages: DailyMessagesData = [];

    const lastMessage = data.map((messageData) => {
      const customerMessageExists = newCustomerMessages.find(
        (customerMessage) => customerMessage.client_id === messageData.client_id,
      );

      if (!customerMessageExists) {
        newCustomerMessages.push(messageData as any);
      }
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(newCustomerMessages);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}