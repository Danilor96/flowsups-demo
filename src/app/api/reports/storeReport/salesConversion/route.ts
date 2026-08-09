import { buildDatePrismaFilter } from '@/app/libs/buildDatePrismaFilter';
import prisma from '@/app/libs/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { SalesConversionSummary, SalesConversionSummaryColsTotal } from './types';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const option = searchParams.get('optionDate');
    const value = searchParams.get('valueDate');
    const from = searchParams.get('fromDate');
    const to = searchParams.get('toDate');

    const dateFilterObject = option ? { option, value, from, to } : null;

    const dateWhereClause = buildDatePrismaFilter(dateFilterObject);

    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        last_name: true,
        username: true,
      },
    });

    const leads = await prisma.leads.findMany({
      where: {
        created_at: dateWhereClause,
      },
      select: {
        sales_rep_id: true,
        customer_status_id: true,
      },
    });

    const salesConversionMap = new Map<number, SalesConversionSummary>();

    users.forEach((user) => {
      if (!salesConversionMap.has(user.id)) {
        const assignedRepId = user.id;
        const userFirstname = user.name;
        const userLastname = user.last_name;
        const username = user.username;
        const assignedRep = `${userFirstname} ${userLastname}${username ? ` - ${username}` : ''}`;

        salesConversionMap.set(user.id, {
          assignedRep,
          assignedRepId,
          totalLead: 0,
          new: 0,
          contacted: 0,
          creditApp: 0,
          delivery: 0,
          undelivered: 0,
          appointment: 0,
          showUp: 0,
          noShowUp: 0,
          deposit: 0,
          sold: 0,
          funding: 0,
          lost: 0,
        });
      }
    });

    const colsTotals: SalesConversionSummaryColsTotal = {
      totalColLeads: 0,
      totalColNew: 0,
      totalColContacted: 0,
      totalColCreditApp: 0,
      totalColDelivery: 0,
      totalColUndelivered: 0,
      totalColAppointment: 0,
      totalColShowUp: 0,
      totalColNoShowUp: 0,
      totalColDeposit: 0,
      totalColSold: 0,
      totalColFunding: 0,
      totalColLost: 0,
    };

    leads.forEach((lead) => {
      if (lead?.sales_rep_id) {
        const mappedData = salesConversionMap.get(lead.sales_rep_id);

        if (mappedData) {
          if (lead.customer_status_id) {
            mappedData.totalLead += 1;

            colsTotals.totalColLeads += 1;
          }

          switch (lead.customer_status_id) {
            case CustomersStatuses.New:
              mappedData.new += 1;

              colsTotals.totalColNew += 1;
              break;

            case CustomersStatuses.Contacted:
              mappedData.contacted += 1;

              colsTotals.totalColContacted += 1;
              break;

            case CustomersStatuses.CreditApp:
              mappedData.creditApp += 1;

              colsTotals.totalColCreditApp += 1;
              break;

            case CustomersStatuses.Delivery:
              mappedData.delivery += 1;

              colsTotals.totalColDelivery += 1;
              break;

            case CustomersStatuses.Undelivery:
              mappedData.undelivered += 1;

              colsTotals.totalColUndelivered += 1;
              break;

            case CustomersStatuses.Appointment:
              mappedData.appointment += 1;

              colsTotals.totalColAppointment += 1;
              break;

            case CustomersStatuses.Show:
              mappedData.showUp += 1;

              colsTotals.totalColShowUp += 1;
              break;

            case CustomersStatuses.NoShowUp:
              mappedData.noShowUp += 1;

              colsTotals.totalColNoShowUp += 1;
              break;

            case CustomersStatuses.Deposit:
              mappedData.deposit += 1;

              colsTotals.totalColDeposit += 1;
              break;

            case CustomersStatuses.Sold:
              mappedData.sold += 1;

              colsTotals.totalColSold += 1;
              break;

            case CustomersStatuses.Funded:
              mappedData.funding += 1;

              colsTotals.totalColFunding += 1;
              break;

            case CustomersStatuses.Lost:
              mappedData.lost += 1;

              colsTotals.totalColLost += 1;
              break;
          }
        }
      }
    });

    const salesConversionSummary = Array.from(salesConversionMap.values());

    return NextResponse.json({ salesConversionSummary, colsTotals });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
