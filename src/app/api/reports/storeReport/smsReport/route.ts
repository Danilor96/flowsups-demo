import { buildDatePrismaFilter } from '@/app/libs/buildDatePrismaFilter';
import { mockDb } from '@/app/libs/mock-db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const option = searchParams.get('optionDate');
    const value = searchParams.get('valueDate');
    const from = searchParams.get('fromDate');
    const to = searchParams.get('toDate');

    const dateFilterObject = option ? { option, value, from, to } : null;
    const dateWhereClause = buildDatePrismaFilter(dateFilterObject);

    const userData = mockDb.users.findMany({
      select: {
        id: true,
        name: true,
        last_name: true,
        username: true,
        _count: {
          select: {
            sms_sender: {
              where: {
                date_sent: dateWhereClause,
                sent_by_user: true,
                manual_sent: true,
              },
            },
          },
        },
      },
    });

    const smsDelivery = mockDb.client_sms.findMany({
      where: {
        date_sent: dateWhereClause,
        manual_sent: true,
        delivered: true,
        failed: false,
        sent_by_user: true,
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      }
    });

    const smsDeliveryByUserMap = smsDelivery.reduce((acc, sms) => {
      const user = sms.user && sms.user.length > 0 ? sms.user[0] : null;
      if(!user) return acc;

      if (acc.has(user.id.toString())) {
        const userMap = acc.get(user.id.toString());
        if (userMap) {
          userMap.smsDeliveryCount += 1;
          acc.set(user.id.toString(), userMap);
        }
      } else {
        acc.set(user.id.toString(), {
          smsDeliveryCount: 1,
        });
      }
      return acc;
    }, new Map<string, { smsDeliveryCount: number }>());

    const smsReplies = mockDb.client_sms.groupBy({
      by: ['replied_to_user_id'],
      where: {
        date_sent: dateWhereClause,
        sent_by_user: false,
        is_reply_to_user: true,
        replied_to_user_id: {
          not: null,
        },
      },
      _count: {
        _all: true,
      },
    });

    const smsRepliesByUserMap = new Map<string, number>(
      smsReplies.map(sms => [sms.replied_to_user_id?.toString() || 'uknown', sms._count._all]),
    );

    const smsFailed = mockDb.client_sms.findMany({
      where: {
        date_sent: dateWhereClause,
        manual_sent: true,
        delivered: false,
        sent_by_user: true,
        failed: true,
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      }
    });

    const smsFailedByUserMap = smsFailed.reduce((acc, sms) => {
      const user = sms.user && sms.user.length > 0 ? sms.user[0] : null;
      if(!user) return acc;

      if (acc.has(user.id.toString())) {
        const userMap = acc.get(user.id.toString());
        if (userMap) {
          userMap.smsFailed += 1;
          acc.set(user.id.toString(), userMap);
        }
      } else {
        acc.set(user.id.toString(), {
          smsFailed: 1,
        });
      }
      return acc;
    }, new Map<string, { smsFailed: number }>());

    const data = userData.map((user) => {
      return {
        id: user.id,
        name: user.name,
        last_name: user.last_name,
        username: user.username,
        fullName: `${user.name || ''} ${user.last_name || ''}`,
        smsTotal: user._count.sms_sender,
        smsDelivery: smsDeliveryByUserMap.get(user.id.toString())?.smsDeliveryCount || 0,
        smsFailed: smsFailedByUserMap.get(user.id.toString())?.smsFailed || 0,
        smsReplies: smsRepliesByUserMap.get(user.id.toString()) || 0
      };
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
