import { FundingStatuses } from '@/app/libs/customer/customersFunctions';
import { buildDateRangeFilter } from '@/app/libs/monthAndYearDateFilter';
import { mockDb, Decimal } from '@/app/libs/mock-db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// todo: multi tenant business id

interface MarketingCost {
  amount: Decimal;
  sourceId: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    const searchMonthDateFilterPrisma = buildDateRangeFilter(startDate, endDate);
    const startOfMonthDateFilter = searchMonthDateFilterPrisma.gte;

    const dealsData = mockDb.deal.findMany({
      include: {
        customer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            lead_source: true,
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

    // todo: multi tenant business id
    const businessId = mockDb.business.findFirst({ select: { id: true } });
    if (!businessId) {
      return NextResponse.json({ serverError: 'Business not found' }, { status: 404 });
    }

    const marketingCosts = mockDb.marketing_cost.findMany({
      where: {
        business_id: businessId.id,
        created_at: searchMonthDateFilterPrisma,
      },
    });
    const marketingCostMap = new Map<string, MarketingCost>(
      marketingCosts.map(cost => [cost.source_id.toString(), { amount: cost.amount, sourceId: cost.source_id }]),
    );

    // const currentTotals = { totalFront: 0, totalBack: 0 };
    // dealsData.forEach(deal => {
    //   let frontend = currentTotals.totalFront;
    //   let backend = currentTotals.totalBack;
    //   if (deal.frontend) {
    //     frontend += parseFloat(deal.frontend.replaceAll(',', ''));
    //   }
    //   if (deal.backend) {
    //     backend += parseFloat(deal.backend.replaceAll(',', ''));
    //   }
    //   currentTotals.totalFront = frontend;
    //   currentTotals.totalBack = backend;
    // });

    const dealsBySource: {
      [key: string]: { sourceId: number; totalSold: number; totalProfit: Decimal; marketingCost: MarketingCost | null };
    } = dealsData.reduce((acc, deal) => {
      const sourceName = deal.customer?.lead_source?.source;
      const sourceId = deal.customer?.lead_source?.id;
      if (!sourceId) return acc;

      const marketingCost = marketingCostMap.get(sourceId.toString());

      let frontend = deal.frontend || Decimal(0);
      let backend = deal.backend || Decimal(0);

      if (sourceName) {
        if (acc[sourceName]) {
          acc[sourceName].totalSold += 1;
          acc[sourceName].totalProfit = acc[sourceName].totalProfit.plus(frontend.plus(backend));
          acc[sourceName].marketingCost = marketingCost ? marketingCost : null;
          // acc[sourceName].marketingCost = marketingCost ? marketingCost : null;
        } else {
          acc[sourceName] = {
            sourceId: sourceId,
            totalSold: 1,
            totalProfit: frontend.plus(backend),
            marketingCost: marketingCost ? marketingCost : null,
          };
        }
      }
      return acc;
    }, {} as { [key: string]: { sourceId: number; totalSold: number; totalProfit: Decimal; marketingCost: MarketingCost | null } });

    const dealsArray = Object.entries(dealsBySource).map(([source, value]) => ({
      source,
      value,
    }));

    return NextResponse.json({ dealsBySource: dealsArray }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}