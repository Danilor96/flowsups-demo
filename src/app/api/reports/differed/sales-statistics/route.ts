import { FundingStatuses } from '@/app/libs/customer/customersFunctions';
import { buildDateRangeFilter, getPreviousMonthDateRange } from '@/app/libs/monthAndYearDateFilter';
import { mockDb, Decimal } from '@/app/libs/mock-db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    const searchMonthDateFilterPrisma = buildDateRangeFilter(startDate, endDate);
    const previousMonthRange = getPreviousMonthDateRange(new Date(startDate || Date.now()));
    //const previousMonthDateWhereFilter = buildDateRangeFilter(previousMonthRange.startDate, previousMonthRange.endDate);
    const startOfMonthDateFilter = searchMonthDateFilterPrisma.gte;

    const dealsCurrentData = mockDb.deal.findMany({
      where: {
        deferredDownpayment: { gt: 0 },
        lead: {
          sold_created_at: searchMonthDateFilterPrisma,
          OR: [
            // CASO 1: El deal está activo (nunca se ha retornado)
            { customer_funding_list_status_id: { not: FundingStatuses.Returned } },
            { customer_funding_returned_at: null },
            // CASO 2: Se retornó, pero NO en este mes (ej. en un mes futuro)
            {
              customer_funding_returned_at: { gt: searchMonthDateFilterPrisma.lte },
            },
          ],
        },
      },
      include: {
        lead: {
          select: {
            id: true,
            customer_funding_list_status_id: true,
            customer_funding_returned_at: true,
            sales_rep: {
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

    const dealPreviousMonths = mockDb.deal.findMany({
      where: {
        // created_at: {
        //   lt: startOfMonthDateFilter, // meses anteriores al current month search
        // },
        deferredDownpayment: { gt: 0 },
        lead: {
          sold_created_at: {
            lt: startOfMonthDateFilter, // meses anteriores al current month search
          },
          OR: [
            // CASO 1: El deal está activo (nunca se ha retornado)
            { customer_funding_list_status_id: { not: FundingStatuses.Returned } },
            { customer_funding_returned_at: null },
            // CASO 2: Se retornó, pero NO en este mes (ej. en un mes futuro)
            {
              customer_funding_returned_at: { gt: searchMonthDateFilterPrisma.lte },
            },
          ],
        },
      },
      include: {
        lead: {
          select: {
            id: true,
            customer_funding_list_status_id: true,
            customer_funding_returned_at: true,
            sales_rep: {
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

    const totalDefferedDownpaymentByUserMap = new Map<
      string,
      {
        sellerId: number;
        sellerFullName: string;
        moneyOweCurrentMonth: Decimal;
        moneyOwePreviousMonth: Decimal;
        bonus: Decimal;
      }
    >();
    dealsCurrentData.forEach(deal => {
      const salesRepId = deal.lead?.sales_rep?.id;
      const salesRepName = deal.lead?.sales_rep?.name;
      const salesRepLastName = deal.lead?.sales_rep?.last_name;
      if (salesRepId) {
        const currentValue = totalDefferedDownpaymentByUserMap.get(salesRepId.toString());
        if (currentValue) {
          currentValue.bonus = currentValue.bonus.add(deal.bonus || Decimal(0));
          currentValue.moneyOwePreviousMonth = Decimal(0);
          currentValue.moneyOweCurrentMonth = currentValue.moneyOweCurrentMonth.add(deal.deferredDownpayment);
          totalDefferedDownpaymentByUserMap.set(salesRepId.toString(), currentValue);
        } else {
          totalDefferedDownpaymentByUserMap.set(salesRepId.toString(), {
            sellerId: salesRepId,
            sellerFullName: `${salesRepName || ''} ${salesRepLastName || ''}`,
            bonus: deal.bonus || Decimal(0),
            moneyOwePreviousMonth: Decimal(0),
            moneyOweCurrentMonth: deal.deferredDownpayment,
          });
        }
      }
    });

    // DEALS PREVIOUS MONTH (deferred downpayment)
    dealPreviousMonths.forEach(previousDeal => {
      const salesRepId = previousDeal.lead?.sales_rep?.id;
      const salesRepName = previousDeal.lead?.sales_rep?.name;
      const salesRepLastName = previousDeal.lead?.sales_rep?.last_name;
      if (salesRepId) {
        const currentValue = totalDefferedDownpaymentByUserMap.get(salesRepId.toString());
        if (currentValue) {
          currentValue.moneyOwePreviousMonth = currentValue.moneyOwePreviousMonth.add(previousDeal.deferredDownpayment);
          // currentValue.moneyOweCurrentMonth = currentValue.moneyOweCurrentMonth.add(previousDeal.deferredDownpayment);
          totalDefferedDownpaymentByUserMap.set(salesRepId.toString(), currentValue);
        } else {
          totalDefferedDownpaymentByUserMap.set(salesRepId.toString(), {
            sellerId: salesRepId,
            sellerFullName: `${salesRepName || ''} ${salesRepLastName || ''}`,
            bonus: Decimal(0),
            moneyOwePreviousMonth: previousDeal.deferredDownpayment,
            moneyOweCurrentMonth: Decimal(0),
          });
        }
      }
    });

    return NextResponse.json({
      data: Array.from(totalDefferedDownpaymentByUserMap.values()),
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
