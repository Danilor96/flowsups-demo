import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { FundingLogSummary } from './types';
import { revalidatePath } from 'next/cache';
import { buildDateRangeFilter } from '@/app/libs/monthAndYearDateFilter';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    const prismaDateFilter = buildDateRangeFilter(startDate, endDate);

    const leads = await prisma.leads.findMany({
      where: {
        customer_status_id: CustomersStatuses.Sold,
        deal: {
          isNot: null,
        },
        // funding_created_at: prismaDateFilter,
        sold_created_at: prismaDateFilter,
      },
      select: {
        id: true,
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
            id: true,
            downpayment: true,
            bonus: true,
            bank: true,
            paid: true,
            loan_id: true,
            created_at: true,
            deferredDownpayment: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            vehicle_identification_numbers: {
              select: {
                vin: true,
              },
            },
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
        sales_manager: {
          select: {
            id: true,
            name: true,
            last_name: true,
            username: true,
          },
        },
        customer_funding_list_status_id: true,
        funding_created_at: true,
        customer_cobuyer: {
          select: {
            cobuyer: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
              },
            },
          },
        },
        isSplitSold: true,
        sellersInSplitDeal: {
          select: {
            id: true,
            name: true,
            last_name: true,
          },
        },
      },
    });

    //await prisma.$disconnect();

    const dataSymmary: FundingLogSummary[] = leads.map((lead) => {
      const customer = lead.clients;
      const vehicleData = lead.vehicle;
      const seller = lead.sales_rep;
      const salesManager = lead.sales_manager;

      const customerFirstName = customer.first_name;
      const customerLastName = customer.last_name;
      const customerName = `${customerFirstName} ${customerLastName}`;
      const phoneNumber = customer.mobile_phone || '';
      const customerId = customer.id;

      const vehicleBrand = vehicleData?.vehicle_brands.brand || '';
      const vehicleModel = vehicleData?.vehicle_models.model || '';
      const vehicleVin = vehicleData?.vehicle_identification_numbers.vin || '';
      const vehicleYear = vehicleData?.vehicle_manufacture_years?.year || '';
      const vehicle = `${vehicleYear} ${vehicleBrand} ${vehicleModel}[${vehicleVin.slice(-6)}]`;
      const vehicleId = vehicleData?.id || 0;

      const salesRepName = seller?.name || '';
      const salesRepLastname = seller?.last_name || '';
      const salesRepUsername = seller?.username || '';
      const salesRep = `${salesRepName} ${salesRepLastname}${
        salesRepUsername ? ` - ${salesRepUsername}` : ''
      }`;
      const salesId = customer?.id || 0;

      const managerRepName = salesManager?.name || '';
      const managerRepLastname = salesManager?.last_name || '';
      const managerRepUsername = salesManager?.username || '';
      const managerRep = `${managerRepName} ${managerRepLastname}${
        managerRepUsername ? ` - ${managerRepUsername}` : ''
      }`;
      const managerId = salesManager?.id || 0;

      const fundingDate = lead.funding_created_at;

      const fundingStatus = lead.customer_funding_list_status_id;

      const downPayment = lead?.deal?.downpayment.toString() || '';
      const deferredDownpayment = lead?.deal?.deferredDownpayment.toString() || '';
      const paid = lead?.deal?.paid.toString() || '';
      const bonus = lead?.deal?.bonus.toString() || '';
      const lender = lead?.deal?.bank?.bank || '';
      const dealId = lead?.deal?.id || 0;
      const loanId = lead?.deal?.loan_id || '';

      const leadId = lead.id;

      const cobuyerFirstname = lead.customer_cobuyer?.cobuyer.first_name || '';
      const cobuyerLastname = lead.customer_cobuyer?.cobuyer.last_name || '';
      const cobuyerId = lead.customer_cobuyer?.cobuyer.id;
      const cobuyerName = `${cobuyerFirstname}${cobuyerLastname ? ` ${cobuyerLastname}` : ''}`;

      return {
        fundingDate,
        customerName,
        phoneNumber,
        vehicle,
        salesRep,
        managerRep,
        lender,
        loanId,
        fundingStatus,
        downPayment,
        paid,
        bonus,
        customerId,
        dealId,
        salesId,
        managerId,
        vehicleId,
        leadId,
        deferredDownpayment,
        cobuyerId,
        cobuyerName,
        isSplitSold: lead.isSplitSold,
        sellersInSplitDeal: lead.sellersInSplitDeal,
      };
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(dataSymmary);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
