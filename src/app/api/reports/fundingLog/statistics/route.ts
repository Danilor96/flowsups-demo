import { mockDb } from '@/app/libs/mock-db';
import { NextRequest, NextResponse } from 'next/server';
import { FundingLogStatisticsSummary } from '../types';
import { CustomersStatuses, FundingStatuses } from '@/app/libs/customer/customersFunctions';
import { revalidatePath } from 'next/cache';
import { buildDateRangeFilter } from '@/app/libs/monthAndYearDateFilter';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    const prismaDateFilter = buildDateRangeFilter(startDate, endDate);

    const users = mockDb.users.findMany({
      select: {
        id: true,
        name: true,
        last_name: true,
        username: true,
      },
    });

    const leads = mockDb.leads.findMany({
      where: {
        customer_status_id: CustomersStatuses.Sold,
        deal: {
          isNot: null,
        },
        sold_created_at: prismaDateFilter,
      },
      select: {
        sales_rep_id: true,
        customer_funding_list_status_id: true,
      },
    });

    const statisticsMap = new Map<number, FundingLogStatisticsSummary>();

    users.forEach((user) => {
      const firstName = user.name;
      const lastName = user.last_name;
      const username = user.username;

      const salesRep = `${firstName} ${lastName}${username ? ` - ${username}` : ''}`;

      if (!statisticsMap.has(user.id)) {
        statisticsMap.set(user.id, {
          salesRep,
          funded: 0,
          pending: 0,
          returned: 0,
          total: 0,
        });
      }
    });

    leads.forEach((lead) => {
      const salesRepId = lead.sales_rep_id;

      const customerFundingStatus = lead.customer_funding_list_status_id;

      if (salesRepId && customerFundingStatus) {
        const dataMapped = statisticsMap.get(salesRepId);

        if (dataMapped) {
          switch (customerFundingStatus) {
            case FundingStatuses.InProcess:
              dataMapped.pending += 1;
              break;

            case FundingStatuses.Funded:
              dataMapped.funded += 1;
              break;

            case FundingStatuses.Returned:
              dataMapped.returned += 1;
              break;
          }

          dataMapped.total += 1;
        }
      }
    });

    const statisticsSummary: FundingLogStatisticsSummary[] = Array.from(statisticsMap.values());

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(statisticsSummary);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
