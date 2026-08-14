import { buildDatePrismaFilter } from '@/app/libs/buildDatePrismaFilter';
import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { ActivityReport, leadTitle } from './types';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const option = searchParams.get('optionDate');
  const value = searchParams.get('valueDate');
  const from = searchParams.get('fromDate');
  const to = searchParams.get('toDate');

  const dateFilterObject = option ? { option, value, from, to } : null;

  try {
    const dateWhereClause = buildDatePrismaFilter(dateFilterObject);

    const leads = mockDb.client_has_lead.findMany({
      where: {
        created_at: dateWhereClause,
      },
      select: {
        id: true,
        created_at: true,
        client_lead: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            seller: {
              select: {
                id: true,
                name: true,
                last_name: true,
                username: true,
              },
            },
            client_status_id: true,
          },
        },
        lead_status: {
          select: {
            id: true,
            status: true,
          },
        },
        client_leads: {
          select: {
            id: true,
            lead: true,
          },
        },
        note_assigned: {
          select: {
            note: true,
          },
        },
        lead_created_by: {
          select: {
            id: true,
            name: true,
            last_name: true,
            username: true,
          },
        },
        assigned_seller: {
          select: {
            id: true,
            name: true,
            last_name: true,
            username: true,
          },
        },
      },
    });

    const activityReportSummary: ActivityReport[] = leads.map((lead) => {
      const leadId = lead.id;

      const customerFirstName = lead.client_lead.first_name;
      const customerLastName = lead.client_lead.last_name;
      const customerName = `${customerFirstName} ${customerLastName}`;
      const customerId = lead.client_lead.id;
      const customerStatusId = lead.client_lead.client_status_id || 0;

      const activityStatus = lead.lead_status.status;
      const activityStatusId = lead.lead_status.id;

      const activityTypeId = lead.client_leads?.id || 0;
      const activityType = leadTitle(activityTypeId).title.replace(':', '');

      const dispositionDescription = lead.client_leads?.lead || 'Other';

      const subject =
        lead.note_assigned?.note || leadTitle(lead.id, lead.client_leads?.lead).subTitle || '';

      const salesRepOnActivityName = lead.assigned_seller?.name || '';
      const salesRepOnActivityLastname = lead.assigned_seller?.last_name || '';
      const salesRepOnActivityUsername = lead.assigned_seller?.username || '';
      const salesRepOnActivityId = lead.assigned_seller?.id || null;
      const assignedRepOnActivity = salesRepOnActivityId
        ? `${salesRepOnActivityName} ${salesRepOnActivityLastname}${
            salesRepOnActivityUsername ? ` - ${salesRepOnActivityUsername}` : ''
          }`
        : '';

      const salesRepOnCustomerName = lead.client_lead.seller?.name || '';
      const salesRepOnCustomerLastname = lead.client_lead.seller?.last_name || '';
      const salesRepOnCustomerUsername = lead.client_lead.seller?.username || '';
      const salesRepOnCustomerId = lead.client_lead.seller?.id || null;
      const assignedSalesRepOnCustomer = salesRepOnCustomerId
        ? `${salesRepOnCustomerName} ${salesRepOnCustomerLastname}${
            salesRepOnCustomerUsername ? ` - ${salesRepOnCustomerUsername}` : ''
          }`
        : '';

      const lastUpdatedDate = lead.created_at;

      const creatorName = lead.lead_created_by?.name || '';
      const creatorLastname = lead.lead_created_by?.last_name || '';
      const creatorUsername = lead.lead_created_by?.username || '';
      const creatorId = lead.lead_created_by?.id || null;
      const lastUpdatedBy = creatorId
        ? `${creatorName} ${creatorLastname}${creatorUsername ? ` - ${creatorUsername}` : ''}`
        : 'Flowsups System';

      return {
        leadId,
        customerName,
        customerId,
        activityStatus,
        activityStatusId,
        activityType,
        dispositionDescription,
        subject,
        assignedRepOnActivity,
        assignedSalesRepOnCustomer,
        lastUpdatedDate,
        lastUpdatedBy,
        customerStatusId,
        activityTypeId,
        salesRepOnActivityId,
        salesRepOnCustomerId,
      };
    });

    return NextResponse.json(activityReportSummary);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
