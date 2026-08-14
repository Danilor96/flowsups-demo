import { buildDatePrismaFilter } from '@/app/libs/buildDatePrismaFilter';
import { mockDb } from '@/app/libs/mock-db';
import { NextResponse, NextRequest } from 'next/server';
import { SalesConversionCustomersDetail } from '../types';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = Number(params.id);

  try {
    const { searchParams } = request.nextUrl;

    const customerStatusId = searchParams.get('customerStatusId');

    const option = searchParams.get('optionDate');
    const value = searchParams.get('valueDate');
    const from = searchParams.get('fromDate');
    const to = searchParams.get('toDate');

    const dateFilterObject = option ? { option, value, from, to } : null;

    const dateWhereClause = buildDatePrismaFilter(dateFilterObject);

    const leads = mockDb.leads.findMany({
      where: {
        created_at: dateWhereClause,
        customer_status_id: Number(customerStatusId),
        sales_rep_id: userId,
      },
      select: {
        customer_id: true,
        clients: {
          select: {
            first_name: true,
            last_name: true,
            mobile_phone: true,
            home_phone: true,
            email: true,
            lead_source: {
              select: {
                source: true,
              },
            },
            born_date: true,
          },
        },
      },
    });

    const customersDetailMap = new Map<number, SalesConversionCustomersDetail>();

    leads.forEach((lead) => {
      if (!customersDetailMap.has(lead.customer_id)) {
        const { clients, customer_id } = lead;

        const id = customer_id;
        const customerFirstname = clients.first_name;
        const customerLastname = clients.last_name;
        const customer = `${customerFirstname} ${customerLastname}`;
        const phoneNumber = clients.mobile_phone || '';
        const homePhone = clients.home_phone || '';
        const email = clients.email || '';
        const source = clients.lead_source?.source || '';
        const dateOfBirth = clients.born_date;

        customersDetailMap.set(lead.customer_id, {
          id,
          customer,
          phoneNumber,
          homePhone,
          email,
          source,
          dateOfBirth,
          total: 1,
        });
      } else {
        const mappedData = customersDetailMap.get(lead.customer_id);

        if (mappedData) {
          mappedData.total += 1;
        }
      }
    });

    const customersDetailSummary = Array.from(customersDetailMap.values());

    return NextResponse.json(customersDetailSummary);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
