import { NextResponse, NextRequest } from 'next/server';
import { mockDb, Decimal } from '@/app/libs/mock-db';
import { startOfMonth, endOfMonth } from 'date-fns';
import { buildDateRangeFilter } from '@/app/libs/monthAndYearDateFilter';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { searchParams } = request.nextUrl;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    const sourceId = parseInt(params.id);
    const formData = await request.formData();
    const marketingCostAmount = formData.get('amount');

    if (isNaN(sourceId)) {
      return NextResponse.json({ error: 'Invalid source ID' }, { status: 400 });
    }

    const amount = marketingCostAmount ? marketingCostAmount.toString() : '0';

    // todo: multi tenant business id
    const businessId = mockDb.business.findFirst({ select: { id: true } });
    if (!businessId) {
      return NextResponse.json({ serverError: 'Business not found' }, { status: 404 });
    }


    const prismaDateFilter = buildDateRangeFilter(startDate, endDate);
    // crear o actualizar un marketing cost para el mes actual y la fuente seleccionada
    const existingMarketingCost = mockDb.marketing_cost.findFirst({
      where: {
        source_id: sourceId,
        created_at: prismaDateFilter,
        business_id: businessId.id,
      },
    });
    console.log({
      existingMarketingCost,
      sourceId,
    })
    const normalizedAmount = amount.replaceAll(',', '.');
    if (existingMarketingCost) {
      mockDb.marketing_cost.update({
        where: {
          id: existingMarketingCost.id,
        },
        data: {
          amount: Decimal(normalizedAmount),
        },
      });
      console.log('updated: ')
    } else {
      console.log('created: ')
      mockDb.marketing_cost.create({
        data: {
          amount: Decimal(normalizedAmount),
          source_id: sourceId,
          business_id: businessId.id,
          created_at: prismaDateFilter.gte,
        },
      });
    }

    return NextResponse.json({ successMessage: 'Marketing cost updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating daily target:', error);
    return NextResponse.json({ serverError: 'Error updating daily target' }, { status: 500 });
  }
}
