import { buildDatePrismaFilter } from '@/app/libs/buildDatePrismaFilter';
import prisma from '@/app/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

enum CallDirection {
  Inbound = 1,
  Outbound = 2,
}

export interface DateAndId {
  date: Date;
  id: number;
}

export interface CallActivitySummary {
  salesRep: string;
  leads: number;
  outbound: number;
  inbound: number;
  manual: number;
  auto: number;
  salesRepId: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const option = searchParams.get('optionDate');
  const value = searchParams.get('valueDate');
  const from = searchParams.get('fromDate');
  const to = searchParams.get('toDate');

  const dateFilterObject = option ? { option, value, from, to } : null;

  try {
    const dateWhereClause = buildDatePrismaFilter(dateFilterObject);

    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        last_name: true,
        username: true,
      },
    });

    const callsData = await prisma.client_calls.findMany({
      where: {
        call_date: dateWhereClause,
      },
      select: {
        call_direction_id: true,
        user_id: true,
      },
    });

    const messageData = await prisma.client_sms.findMany({
      where: {
        date_sent: dateWhereClause,
        sent_by_user: true,
      },
      select: {
        user: {
          select: {
            id: true,
          },
        },
        manual_sent: true,
      },
    });

    const leadsByUsers = await prisma.users_has_customers.findMany({
      where: {
        created_at: dateWhereClause,
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    //await prisma.$disconnect();

    const salesRepMap = new Map<number, CallActivitySummary>();

    users.forEach((user) => {
      const userId = user.id;
      const name = user.name || '';
      const lastname = user.last_name || '';
      const username = user.username || '';
      const salesRep = `${name} ${lastname}${username ? ` - ${username}` : ''}`;

      if (!salesRepMap.has(userId)) {
        salesRepMap.set(userId, {
          salesRep: salesRep,
          outbound: 0,
          inbound: 0,
          manual: 0,
          auto: 0,
          leads: 0,
          salesRepId: userId,
        });
      }
    });

    callsData.forEach((call) => {
      call.user_id.forEach((userId) => {
        const data = salesRepMap.get(userId);

        if (data) {
          if (call.call_direction_id === CallDirection.Outbound) {
            data.outbound += 1;
          } else {
            data.inbound += 1;
          }
        }
      });
    });

    messageData.forEach((mssg) => {
      mssg.user.forEach((user) => {
        const data = salesRepMap.get(user.id);

        if (data) {
          if (mssg.manual_sent) {
            data.manual += 1;
          } else {
            data.auto += 1;
          }
        }
      });
    });

    leadsByUsers.forEach((lead) => {
      const data = salesRepMap.get(lead.user_id);

      if (data) {
        data.leads += 1;
      }
    });

    const dataToReturn: CallActivitySummary[] = Array.from(salesRepMap.values());

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(dataToReturn);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
