import { FundingStatuses } from '@/app/libs/customer/customersFunctions';
import { buildDateRangeFilter, getPreviousMonthDateRange } from '@/app/libs/monthAndYearDateFilter';
import { mockDb } from '@/app/libs/mock-db';
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

    const onlyPending = searchParams.get('onlyPending') === 'true';

    const where: any = {
      lead: {
        sold_created_at: searchMonthDateFilterPrisma,
        OR: [
          // CASO 1: El deal está activo (nunca se ha retornado)
          { customer_funding_list_status_id: { not: FundingStatuses.Returned } },
          { customer_funding_returned_at: null },
          // CASO 2: Se retornó, pero NO en este mes (ej. en un mes futuro)
        ],
      },
    };

    if (onlyPending) {
      where.deferredDownpayment = {
        gt: 0,
      };
    } else {
      where.paymentDate = {
        some: {},
      };
    }

    const dealsCurrentData = mockDb.deal.findMany({
      where,
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
            mobile_phone: true,
            interested_vehicle: {
              select: {
                id: true,
                stock_no: true,
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
            isSplitSold: true,
            vehicle: {
              select: {
                id: true,
                stock_no: true,
                vehicle_brands: true,
                vehicle_models: true,
                vehicle_manufacture_years: true,
                vehicle_identification_numbers: true,
                entry_stock: true,
              },
            },
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
    });

    return NextResponse.json({
      deals: dealsCurrentData,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
