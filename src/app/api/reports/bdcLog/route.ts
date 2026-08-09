import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';
import prisma from '@/app/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { BdcLogSummary } from './types';
import { revalidatePath } from 'next/cache';
import { buildDateRangeFilter } from '@/app/libs/monthAndYearDateFilter';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    const prismaDateFilter = buildDateRangeFilter(startDate, endDate);

    const leads = await prisma.leads.findMany({
      where: {
        customer_status_id: {
          in: [CustomersStatuses.Sold, CustomersStatuses.Funded],
        },
        bdc: {
          isNot: null,
        },
        OR: [{ sold_created_at: prismaDateFilter }, { funding_created_at: prismaDateFilter }],
      },
      select: {
        id: true,
        sold_created_at: true,
        funding_created_at: true,
        clients: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
        sales_rep: {
          select: {
            id: true,
            name: true,
            last_name: true,
            username: true,
          },
        },
        bdc: {
          select: {
            id: true,
            name: true,
            last_name: true,
            username: true,
          },
        },
        sales_manager: {
          select: {
            id: true,
            name: true,
            last_name: true,
            username: true,
          },
        },
      },
    });

    // await prisma.$disconnect();

    const bdcSummary: BdcLogSummary[] = leads.map((lead) => {
      const customer = lead.clients;

      const firstname = customer.first_name;
      const lastname = customer.last_name;
      const customerName = `${firstname} ${lastname}`;
      const customerId = customer.id;

      const soldFundingDate = lead.sold_created_at || lead.funding_created_at;

      const salesRepData = lead.sales_rep;

      const salesRepName = salesRepData?.name || '';
      const salesRepLastname = salesRepData?.last_name || '';
      const salesRepUsername = salesRepData?.username || '';
      const salesRep = `${salesRepName} ${salesRepLastname}${
        salesRepUsername ? ` - ${salesRepUsername}` : ''
      }`;
      const salesRepId = salesRepData?.id || null;

      const bdcData = lead.bdc;

      const bdcRepName = bdcData?.name || '';
      const bdcRepLastname = bdcData?.last_name || '';
      const bdcRepUsername = bdcData?.username || '';
      const bdcRep = `${bdcRepName} ${bdcRepLastname}${
        bdcRepUsername ? ` - ${bdcRepUsername}` : ''
      }`;
      const bdcRepId = bdcData?.id || null;

      const salesManagerData = lead.sales_manager;

      const managerRepName = salesManagerData?.name || '';
      const managerRepLastname = salesManagerData?.last_name || '';
      const managerRepUsername = salesManagerData?.username || '';
      const managerRep = `${managerRepName} ${managerRepLastname}${
        managerRepUsername ? ` - ${managerRepUsername}` : ''
      }`;
      const managerRepId = salesManagerData?.id || null;

      const leadId = lead.id;

      return {
        customerName,
        salesRep,
        salesRepId,
        bdcRep,
        bdcRepId,
        managerRep,
        managerRepId,
        customerId,
        soldFundingDate,
        leadId,
      };
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(bdcSummary);
  } catch (error) {
    console.log(error);

    // await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
