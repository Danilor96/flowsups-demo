import { FundingStatuses } from '@/app/libs/customer/customersFunctions';
import { buildDateRangeFilter } from '@/app/libs/monthAndYearDateFilter';
import { mockDb } from '@/app/libs/mock-db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    const searchMonthDateFilterPrisma = buildDateRangeFilter(startDate, endDate);
    const startOfMonthDateFilter = searchMonthDateFilterPrisma.gte;

    const dealsData = mockDb.deal.findMany({
      select: {
        id: true,
        bank: true,
        seller: {
          select: {
            id: true,
            name: true,
            last_name: true,
          },
        },
        lead: {
          select: {
            isSplitSold: true,
            sellersInSplitDeal: {
              select: {
                id: true,
                name: true,
                last_name: true,
              },
            },
          },
        },
      },
      where: {
        created_at: searchMonthDateFilterPrisma,
        lead: {
          OR: [
            { customer_funding_list_status_id: { not: FundingStatuses.Returned } },
            { customer_funding_returned_at: null },
            // CASO 2: Se retornó, pero NO en este mes (ej. en un mes futuro)
            {
              customer_funding_returned_at: { gt: searchMonthDateFilterPrisma.lte },
            },
          ],
        },
      },
    });

    const otherDeals = mockDb.other_sales_log.groupBy({
      by: ['assigned_seller_id'],
      where: {
        date: searchMonthDateFilterPrisma,
        assigned_seller_id: { not: null },
      },
      _count: {
        _all: true,
      },
    });

    const previousDealsReturnedThisMonth = mockDb.deal.findMany({
      where: {
        created_at: {
          lt: startOfMonthDateFilter, // meses anteriores al current month search
        },
        lead: {
          customer_funding_list_status_id: FundingStatuses.Returned,
          customer_funding_returned_at: searchMonthDateFilterPrisma,
        },
      },
      select: {
        id: true,
        bank: true,
        seller: {
          select: {
            id: true,
            name: true,
            last_name: true,
          },
        },
        lead: {
          select: {
            isSplitSold: true,
            sellersInSplitDeal: {
              select: {
                id: true,
                name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });

    const countRts = previousDealsReturnedThisMonth.reduce(
      (acc: Map<string, { id: number; totalRts: number }>, deal) => {
        if (!deal.seller) return acc;

        const userId = deal.seller.id;
        const isSplitSold = deal.lead?.isSplitSold;

        if (isSplitSold) {
          deal.lead?.sellersInSplitDeal.forEach((seller: any) => {
            if (acc.has(seller.id.toString())) {
              const userMap = acc.get(seller.id.toString());
              if (userMap) {
                userMap.totalRts += 0.5;
                acc.set(seller.id.toString(), userMap);
              }
            } else {
              acc.set(seller.id.toString(), {
                id: seller.id,
                totalRts: 0.5,
              });
            }
          });
          return acc;
        }

        if (acc.has(userId.toString())) {
          const userMap = acc.get(userId.toString());
          if (userMap) {
            userMap.totalRts += 1;
            acc.set(userId.toString(), userMap);
          }
        } else {
          acc.set(userId.toString(), {
            id: userId,
            totalRts: 1,
          });
        }

        return acc;
      },
      new Map<string, { id: number; totalRts: number }>(),
    );

    const numberOtherDealsByUser = new Map<string, number>(
      otherDeals.map(otherDeal => [otherDeal.assigned_seller_id?.toString() || '0', otherDeal._count._all]),
    );

    const numberStoreDealsByUser = dealsData.reduce(
      (acc: Map<string, { id: number; fullName: string; totalStore: number }>, deal) => {
        if (!deal.seller) return acc;

        const userId = deal.seller.id;
        const isSplitSold = deal.lead?.isSplitSold;

        if (isSplitSold) {
          deal.lead?.sellersInSplitDeal.forEach((seller: any) => {
            if (acc.has(seller.id.toString())) {
              const userMap = acc.get(seller.id.toString());
              if (userMap) {
                userMap.totalStore += 0.5;
                acc.set(seller.id.toString(), userMap);
              }
            } else {
              acc.set(seller.id.toString(), {
                id: seller.id,
                fullName: `${seller.name} ${seller.last_name}`,
                totalStore: 0.5,
              });
            }
          });
          return acc;
        }

        if (acc.has(userId.toString())) {
          const userMap = acc.get(userId.toString());
          if (userMap) {
            userMap.totalStore += 1;
            acc.set(userId.toString(), userMap);
          }
        } else {
          acc.set(userId.toString(), {
            id: userId,
            fullName: `${deal.seller.name} ${deal.seller.last_name}`,
            totalStore: 1,
          });
        }

        return acc;
      },
      new Map<string, { id: number; fullName: string; totalStore: number }>(),
    );

    const users = mockDb.users.findMany({
      select: {
        id: true,
        name: true,
        last_name: true,
      },
    });

    const dealsArray = users.map(user => ({
      id: user.id,
      fullName: `${user.name} ${user.last_name}`,
      totalStore: numberStoreDealsByUser.get(user.id.toString())?.totalStore || 0,
      totalOther: numberOtherDealsByUser.get(user.id.toString()) || 0,
      totalRts: countRts.get(user.id.toString())?.totalRts || 0,
    }));

    return NextResponse.json({ dealsBySales: dealsArray }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
