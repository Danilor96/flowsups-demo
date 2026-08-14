import { FundingStatuses } from '@/app/libs/customer/customersFunctions';
import { buildDateRangeFilter, getPreviousMonthDateRange } from '@/app/libs/monthAndYearDateFilter';
import { mockDb, Decimal } from '@/app/libs/mock-db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const include = {
  customer: {
    select: {
      id: true,
      first_name: true,
      last_name: true,
      ad_id: true,
      lead_source: true,
      funding_list_status: true,
      funding_list_status_id: true,
      interested_vehicle: {
        select: {
          id: true,
          vehicle_brands: true,
          vehicle_models: true,
          vehicle_manufacture_years: true,
          vehicle_identification_numbers: true,
          entry_stock: true,
        },
      },
      seller: {
        select: {
          id: true,
          name: true,
          last_name: true,
        },
      },
      sales_manager: {
        select: {
          id: true,
          name: true,
          last_name: true,
        },
      },
      finance_manager: {
        select: {
          id: true,
          name: true,
          last_name: true,
        },
      },
    },
  },
  lead: {
    select: {
      id: true,
      customer_funding_list_status_id: true,
      customer_funding_returned_at: true,
      sold_created_at: true,
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
  bank: true,
};

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
        customer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            ad_id: true,
            lead_source: true,
            funding_list_status: true,
            funding_list_status_id: true,
            interested_vehicle: {
              select: {
                id: true,
                stock_no: true,
                vehicle_brands: true,
                vehicle_models: true,
                vehicle_manufacture_years: true,
                vehicle_identification_numbers: true,
                entry_stock: true,
                vehicle_status: true,
              },
            },
            seller: {
              select: {
                id: true,
                name: true,
                last_name: true,
              },
            },
            sales_manager: {
              select: {
                id: true,
                name: true,
                last_name: true,
              },
            },
            finance_manager: {
              select: {
                id: true,
                name: true,
                last_name: true,
              },
            },
          },
        },
        lead: {
          select: {
            id: true,
            customer_funding_list_status_id: true,
            customer_funding_returned_at: true,
            sold_created_at: true,
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
        bank: true,
      },
      orderBy: {
        // created_at: 'desc',
        lead: {
          sold_created_at: 'desc',
        },
      },
    });

    //const dealsValidReturned

    const dealsReturnedThisMonth = mockDb.deal.findMany({
      where: {
        lead: {
          customer_funding_list_status_id: FundingStatuses.Returned,
          customer_funding_returned_at: searchMonthDateFilterPrisma,
          sold_created_at: searchMonthDateFilterPrisma,
        },
      },
      include: include,
    });

    const previousDealsReturnedThisMonth = mockDb.deal.findMany({
      where: {
        // created_at: {
        //   lt: startOfMonthDateFilter, // meses anteriores al current month search
        // },
        lead: {
          sold_created_at: {
            lt: startOfMonthDateFilter,
          },
          customer_funding_list_status_id: FundingStatuses.Returned,
          customer_funding_returned_at: searchMonthDateFilterPrisma,
        },
      },
      include: include,
    });

    const sumTotalCharges = mockDb.charges_back.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        created_at: searchMonthDateFilterPrisma,
      },
    });

    const returnedCurrentMonth = dealsReturnedThisMonth.length;
    const currentTotals = { totalFront: Decimal(0), totalBack: Decimal(0) };
    dealsCurrentData.forEach(deal => {
      let frontend = currentTotals.totalFront;
      let backend = currentTotals.totalBack;
      if (deal.frontend) {
        frontend = frontend.plus(deal.frontend);
      }
      if (deal.backend) {
        backend = backend.plus(deal.backend);
      }
      currentTotals.totalFront = frontend;
      currentTotals.totalBack = backend;
    });

    const previousMonthsReturnedTotals = { totalReturnedFront: Decimal(0), totalReturnedBack: Decimal(0) };
    previousDealsReturnedThisMonth.forEach(deal => {
      let frontend = previousMonthsReturnedTotals.totalReturnedFront;
      let backend = previousMonthsReturnedTotals.totalReturnedBack;
      if (deal.frontend) {
        frontend = frontend.plus(deal.frontend);
      }
      if (deal.backend) {
        backend = backend.plus(deal.backend);
      }
      previousMonthsReturnedTotals.totalReturnedFront = frontend;
      previousMonthsReturnedTotals.totalReturnedBack = backend;
    });

    //descontar total de retorneds estes mes que son vienen de meses previos
    const totalFront = currentTotals.totalFront.minus(previousMonthsReturnedTotals.totalReturnedFront);
    const totalBack = currentTotals.totalBack.minus(previousMonthsReturnedTotals.totalReturnedBack);
    const totalGross = totalFront.plus(totalBack) || 0;

    const sumTotalChargesAmount = sumTotalCharges?._sum?.amount || Decimal(0);
    const totalNet = totalGross.minus(sumTotalChargesAmount) || 0;

    return NextResponse.json({
      deals: dealsCurrentData.concat(previousDealsReturnedThisMonth).concat(dealsReturnedThisMonth),
      totalCharges: sumTotalCharges._sum.amount || 0,
      totalFront: totalFront.toNumber() || 0,
      totalBack: totalBack.toNumber() || 0,
      totalGross: totalGross.toNumber() || 0,
      totalNet: totalNet.toNumber() || 0,
      returnedCurrentMonth: dealsReturnedThisMonth.length || 0,
      returnedLastMonth: previousDealsReturnedThisMonth.length || 0,
      monthUnitSold: dealsCurrentData.length || 0,
      totalUnitsSold: dealsCurrentData.length - previousDealsReturnedThisMonth.length || 0,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
