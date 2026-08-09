import { buildDatePrismaFilter } from '@/app/libs/buildDatePrismaFilter';
import prisma from '@/app/libs/prisma';
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ReferrerSummary } from './type';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const option = searchParams.get('optionDate');
  const value = searchParams.get('valueDate');
  const from = searchParams.get('fromDate');
  const to = searchParams.get('toDate');

  const dateFilterObject = option ? { option, value, from, to } : null;

  // referrer: is the referrer customer and is related to the "main" customer
  // buyer: is the "main" customer

  try {
    const dateWhereClause = buildDatePrismaFilter(dateFilterObject);

    const leads = await prisma.leads.findMany({
      where: {
        customer_referrer: {
          buyer: {},
          referrer: {},
          created_at: dateWhereClause,
        },
      },
      select: {
        created_at: true,
        sales_rep: {
          select: {
            name: true,
            last_name: true,
            username: true,
          },
        },
        vehicle: {
          select: {
            general_info: {
              select: {
                stock_no: true,
              },
            },
            title_license: {
              select: {
                buyer_fee: true,
              },
            },
          },
        },
        customer_funding_list_status: {
          select: {
            status: true,
          },
        },
        customer_referrer: {
          select: {
            id: true,
            amount: true,
            created_at: true,
            buyer: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                mobile_phone: true,
                contact_method_id: true,
                contact_time_id: true,
                client_address: {
                  select: {
                    city: true,
                    county: {
                      select: {
                        county: true,
                      },
                    },
                    street: true,
                    state: {
                      select: {
                        state: true,
                      },
                    },
                    zip: true,
                  },
                },
              },
            },
            referrer: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });

    await prisma.$disconnect();

    const referrerSummary: ReferrerSummary[] = leads.map((lead) => {
      const { customer_referrer, vehicle, customer_funding_list_status, sales_rep } = lead;

      const firstname = customer_referrer?.buyer.first_name;
      const lastname = customer_referrer?.buyer.last_name;
      const customerName = `${firstname} ${lastname}`;
      const customerId = customer_referrer?.buyer.id || 0;
      const mobilePhone = customer_referrer?.buyer.mobile_phone || '';
      const fundingStatus = customer_funding_list_status?.status || '';

      const city = customer_referrer?.buyer?.client_address?.city || '';
      const county = customer_referrer?.buyer?.client_address?.county || '';
      const state = customer_referrer?.buyer?.client_address?.state;
      const street = customer_referrer?.buyer?.client_address?.street || '';
      const zip = customer_referrer?.buyer?.client_address?.zip || '';

      const address = `${street}, ${city}, ${state?.state || ''}${zip ? `, ${zip}` : ''}${
        county ? `, ${county}` : ''
      }`;

      const salesRepName = sales_rep?.name || '';
      const salesRepLastname = sales_rep?.last_name || '';
      const salesRepUsername = sales_rep?.username;
      const salesRep = `${salesRepName} ${salesRepLastname}${
        salesRepUsername ? salesRepUsername : ''
      }`;

      const contacted =
        customer_referrer?.buyer.contact_method_id && customer_referrer?.buyer.contact_time_id
          ? true
          : false;

      const amount = customer_referrer?.amount?.toString() || '';

      const stockNumber = vehicle?.general_info?.stock_no;
      const fee = vehicle?.title_license?.buyer_fee || '';

      const newCustomerFirstname = customer_referrer?.referrer.first_name || '';
      const newCustomerLastname = customer_referrer?.referrer.last_name || '';
      const newCustomerName = `${newCustomerFirstname} ${newCustomerLastname}`;
      const newCustomerNameId = customer_referrer?.referrer.id || 0;

      const date = customer_referrer?.created_at || lead.created_at;

      const referrerDataId = customer_referrer?.id || 0;

      return {
        customerName,
        customerId,
        mobilePhone,
        salesRep,
        contacted,
        address,
        amount,
        stockNumber,
        newCustomerName,
        date,
        fee,
        fundingStatus,
        newCustomerNameId,
        referrerDataId,
      };
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(referrerSummary);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
