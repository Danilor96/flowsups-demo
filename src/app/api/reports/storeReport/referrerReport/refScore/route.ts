import { buildDatePrismaFilter } from '@/app/libs/buildDatePrismaFilter';
import { mockDb } from '@/app/libs/mock-db';
import { NextRequest, NextResponse } from 'next/server';
import { RefScoreSummary } from '../type';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const option = searchParams.get('optionDate');
  const value = searchParams.get('valueDate');
  const from = searchParams.get('fromDate');
  const to = searchParams.get('toDate');

  const dateFilterObject = option ? { option, value, from, to } : null;

  try {
    const dateWhereClause = buildDatePrismaFilter(dateFilterObject);

    const leads = mockDb.leads.findMany({
      where: {
        customer_referrer: {
          buyer: {},
          referrer: {},
          created_at: dateWhereClause,
        },
      },
      select: {
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
        vehicle: {
          select: {
            id: true,
            general_info: {
              select: {
                stock_no: true,
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
            vehicle_identification_numbers: {
              select: {
                vin: true,
              },
            },
          },
        },
        customer_referrer: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                last_name: true,
                username: true,
              },
            },
            referrer: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                mobile_phone: true,
              },
            },
          },
        },
      },
    });

    const refSourceSummary: RefScoreSummary[] = leads.map((lead) => {
      const { bdc, sales_rep, customer_referrer, vehicle: vehicleData } = lead;

      const refUserName = customer_referrer?.user.name || '';
      const refUserLastname = customer_referrer?.user.last_name || '';
      const refUsername = customer_referrer?.user.username || '';
      const referralName = `${refUserName} ${refUserLastname}${
        refUsername ? ` - ${refUsername}` : ''
      }`;

      const salesUserName = sales_rep?.name || '';
      const salesUserLastname = sales_rep?.last_name || '';
      const salesUsername = sales_rep?.username || '';
      const salesAssigned = `${salesUserName} ${salesUserLastname}${
        salesUsername ? ` - ${salesUsername}` : ''
      }`;

      const bdcUserName = bdc?.name || '';
      const bdcUserLastname = bdc?.last_name || '';
      const bdcUsername = bdc?.username || '';
      const bdcAssigned = `${bdcUserName} ${bdcUserLastname}${
        bdcUsername ? ` - ${bdcUsername}` : ''
      }`;

      const customerFirstname = customer_referrer?.referrer.first_name;
      const customerLastname = customer_referrer?.referrer.last_name;
      const customerName = `${customerFirstname} ${customerLastname}`;
      const customerId = customer_referrer?.referrer.id || 0;
      const phoneNumber = customer_referrer?.referrer.mobile_phone || '';

      const customerSold = 0;

      const stockNumber = vehicleData?.general_info?.stock_no || null;

      const vehicelBrand = vehicleData?.vehicle_brands.brand;
      const vehicelModel = vehicleData?.vehicle_models.model;
      const vehicleVin = vehicleData?.vehicle_identification_numbers.vin;
      const vehicleYear = vehicleData?.vehicle_manufacture_years?.year;
      const vehicle = `${vehicleYear} ${vehicelBrand} ${vehicelModel}[${vehicleVin?.slice(-6)}]`;
      const vehicleId = vehicleData?.id || null;

      return {
        referralName,
        customerSold,
        customerName,
        customerId,
        stockNumber,
        vehicle,
        vehicleId,
        phoneNumber,
        salesAssigned,
        bdcAssigned,
      };
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(refSourceSummary);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
