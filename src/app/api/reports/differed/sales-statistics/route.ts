import { FundingStatuses } from '@/app/libs/customer/customersFunctions';
import { buildDateRangeFilter, getPreviousMonthDateRange } from '@/app/libs/monthAndYearDateFilter';
import prisma from '@/app/libs/prisma';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const Decimal = Prisma.Decimal;

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

    const dealsCurrentData = await prisma.deal.findMany({
      where: {
        // created_at: searchMonthDateFilterPrisma,
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

    const dealPreviousMonths = await prisma.deal.findMany({
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
        moneyOweCurrentMonth: Prisma.Decimal;
        moneyOwePreviousMonth: Prisma.Decimal;
        bonus: Prisma.Decimal;
      }
    >();
    dealsCurrentData.forEach(deal => {
      const salesRepId = deal.lead?.sales_rep?.id;
      const salesRepName = deal.lead?.sales_rep?.name;
      const salesRepLastName = deal.lead?.sales_rep?.last_name;
      if (salesRepId) {
        const currentValue = totalDefferedDownpaymentByUserMap.get(salesRepId.toString());
        if (currentValue) {
          currentValue.bonus = currentValue.bonus.add(deal.bonus || Prisma.Decimal(0));
          currentValue.moneyOwePreviousMonth = Prisma.Decimal(0);
          currentValue.moneyOweCurrentMonth = currentValue.moneyOweCurrentMonth.add(deal.deferredDownpayment);
          totalDefferedDownpaymentByUserMap.set(salesRepId.toString(), currentValue);
        } else {
          totalDefferedDownpaymentByUserMap.set(salesRepId.toString(), {
            sellerId: salesRepId,
            sellerFullName: `${salesRepName || ''} ${salesRepLastName || ''}`,
            bonus: deal.bonus || Prisma.Decimal(0),
            moneyOwePreviousMonth: Prisma.Decimal(0),
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
          // currentValue.bonus = currentValue.bonus.add(previousDeal.bonus || Prisma.Decimal(0));
          currentValue.moneyOwePreviousMonth = currentValue.moneyOwePreviousMonth.add(previousDeal.deferredDownpayment);
          // currentValue.moneyOweCurrentMonth = currentValue.moneyOweCurrentMonth.add(previousDeal.deferredDownpayment);
          totalDefferedDownpaymentByUserMap.set(salesRepId.toString(), currentValue);
        } else {
          totalDefferedDownpaymentByUserMap.set(salesRepId.toString(), {
            sellerId: salesRepId,
            sellerFullName: `${salesRepName || ''} ${salesRepLastName || ''}`,
            bonus: Prisma.Decimal(0),
            moneyOwePreviousMonth: previousDeal.deferredDownpayment,
            moneyOweCurrentMonth: Prisma.Decimal(0),
          });
        }
      }
    });

    return NextResponse.json({
      data: Array.from(totalDefferedDownpaymentByUserMap.values()),
    });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
