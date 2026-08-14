import { FundingStatuses } from '@/app/libs/customer/customersFunctions';
import { buildDateRangeFilter } from '@/app/libs/monthAndYearDateFilter';
import { mockDb, Decimal } from '@/app/libs/mock-db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    const searchMonthDateFilterPrisma = buildDateRangeFilter(startDate, endDate);
    const dealsData = mockDb.deal.findMany({
      where: {
        created_at: searchMonthDateFilterPrisma,
        lead: {
          OR: [
            { customer_funding_list_status_id: { not: FundingStatuses.Returned } },
            { customer_funding_returned_at: null },
            // CASO 2: Se retornó, pero NO en este mes (ej. en un mes futuro){
            { customer_funding_returned_at: { gt: searchMonthDateFilterPrisma.lte } },
          ],
        },
      },
      select: {
        id: true,
        bank: true,
        frontend: true,
        backend: true,
        // totalProfit: true,
      },
    });

    const numberDealsByBank = dealsData.reduce(
      (acc: { [key: string]: { name : string, totalProfit: Decimal; sold: number } }, deal) => {
        let frontend = deal.frontend || Decimal(0)
        let backend = deal.backend || Decimal(0)

        const bankId = deal.bank?.id?.toString();
        if (bankId) {
          if (acc[bankId]) {
            const registeredBank = acc[bankId];
            registeredBank.sold = acc[bankId].sold + 1;
            registeredBank.totalProfit = registeredBank.totalProfit.plus(frontend.plus(backend));
            registeredBank.name = deal.bank?.bank || '';
          } else {
            acc[bankId] = {
              totalProfit: frontend.plus(backend),
              sold: 1,
              name: deal.bank?.bank || '',
            };
          }
        }
        return acc;
      },
      {},
    );

    const dealsArray = Object.entries(numberDealsByBank).map(([bankId, value]) => ({
      id: bankId,
      name: value.name,
      sold: value.sold || 0,
      profit: value.totalProfit || 0,
    }));

    return NextResponse.json({ dealsByBank: dealsArray }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}