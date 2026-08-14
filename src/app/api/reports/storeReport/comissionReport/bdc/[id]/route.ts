import { mockDb } from '@/app/libs/mock-db';
import { NextRequest, NextResponse } from 'next/server';
import { buildDateRangeFilter } from '@/app/libs/monthAndYearDateFilter';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';
import { SalesSummary } from '../../types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = Number(params.id);

  const { searchParams } = request.nextUrl;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    const prismaDateFilter = buildDateRangeFilter(startDate, endDate);

    const leads = mockDb.leads.findMany({
      where: {
        bdc_id: userId,
        customer_status_id: {
          in: [CustomersStatuses.Sold, CustomersStatuses.Funded],
        },
        end_at: prismaDateFilter,
      },
      select: {
        clients: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            mobile_phone: true,
          },
        },
        deal: {
          select: {
            created_at: true,
            downpayment: true,
            paid: true,
            bonus: true,
            moneyDuePaid: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            vehicle_brands: {
              select: {
                brand: true,
              },
            },
            vehicle_models: {
              select: {
                model: true,
              },
            },
            vehicle_manufacture_years: {
              select: {
                year: true,
              },
            },
            vehicle_identification_numbers: {
              select: {
                vin: true,
              },
            },
            general_info: {
              select: {
                date_in_stock: true,
                stock_no: true,
              },
            },
          },
        },
      },
    });

    const salesSummary: SalesSummary[] = leads.map((lead) => {
      const customerFirstName = lead.clients.first_name;
      const customerLastName = lead.clients.last_name;
      const customerName = `${customerFirstName} ${customerLastName}`;
      const customerId = lead.clients.id;

      const phoneNumber = lead.clients.mobile_phone || '';

      const brand = lead.vehicle?.vehicle_brands?.brand || '';
      const model = lead.vehicle?.vehicle_models?.model || '';
      const year = lead.vehicle?.vehicle_manufacture_years?.year || '';
      const vin = lead.vehicle?.vehicle_identification_numbers.vin || '';
      const vehicle = lead.vehicle?.id
        ? `${year} ${brand} ${model}[${vin.slice(-6)}]`
        : 'No vehicle';
      const stockNumber = lead.vehicle?.general_info?.stock_no || '';

      const dealDate = lead.deal?.created_at || null;

      let dealStatus = '';

      const bonus = lead.deal?.bonus;
      const downpayment = lead.deal?.downpayment;
      const paid = lead.deal?.paid;
      const moneyDuePaid = lead.deal?.moneyDuePaid;

      if (downpayment && paid) {
        const toSubstract = paid.plus(bonus || 0).plus(moneyDuePaid || 0);

        const mainOperation = downpayment.minus(toSubstract);

        const isDealDone = Number(mainOperation) === 0;

        dealStatus = isDealDone ? 'Done' : 'In process';
      }

      return {
        customerName,
        customerId,
        vehicle,
        stockNumber,
        phoneNumber,
        dealDate,
        dealStatus,
      };
    });

    return NextResponse.json(salesSummary);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
