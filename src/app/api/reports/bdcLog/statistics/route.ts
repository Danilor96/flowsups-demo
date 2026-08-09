import prisma from '@/app/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { BdcLogStatisticsSummary, DefaultRoles } from '../types';
import { revalidatePath } from 'next/cache';
import { buildDateRangeFilter } from '@/app/libs/monthAndYearDateFilter';
import { CustomersStatuses, FundingStatuses } from '@/app/libs/customer/customersFunctions';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    const prismaDateFilter = buildDateRangeFilter(startDate, endDate);

    const users = await prisma.users.findMany({
      where: {
        user_has: {
          some: {
            role_id: DefaultRoles.Bdc,
          },
        },
      },
      select: {
        id: true,
        name: true,
        last_name: true,
        username: true,
      },
    });

    const leads = await prisma.leads.findMany({
      where: {
        bdc: {
          isNot: null,
        },
        customer_status_id: {
          in: [CustomersStatuses.Sold, CustomersStatuses.Funded],
        },
        OR: [{ sold_created_at: prismaDateFilter }, { funding_created_at: prismaDateFilter }],
      },
      select: {
        bdc_id: true,
        customer_funding_list_status_id: true,
      },
    });

    // await prisma.$disconnect();

    const bdcLogStatisticsMap = new Map<number, BdcLogStatisticsSummary>();

    users.forEach((user) => {
      const name = user.name;
      const lastname = user.last_name;
      const username = user.username;
      const bdc = `${name} ${lastname}${username ? ` - ${username}` : ''}`;

      const sold = 0;
      const rts = 0;
      const other = 0;
      const total = 0;

      bdcLogStatisticsMap.set(user.id, {
        bdc,
        sold,
        rts,
        other,
        total,
      });
    });

    leads.forEach((lead) => {
      const fundingStatusId = lead.customer_funding_list_status_id;
      const bdcId = lead.bdc_id;

      if (bdcId) {
        const objMapped = bdcLogStatisticsMap.get(bdcId);

        if (objMapped) {
          if (fundingStatusId && fundingStatusId === FundingStatuses.Returned) {
            objMapped.rts += 1;
            objMapped.total -= 1;
          }

          objMapped.sold += 1;
          objMapped.total += 1;
        }
      }
    });

    const bdcLogStatisticsSummary = Array.from(bdcLogStatisticsMap.values());

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(bdcLogStatisticsSummary);
  } catch (error) {
    console.log(error);

    // await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
