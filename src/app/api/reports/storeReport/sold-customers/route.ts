import { mockDb } from '@/app/libs/mock-db';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { buildDatePrismaFilter } from '@/app/libs/buildDatePrismaFilter';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {

  const { searchParams } = req.nextUrl;
  const option = searchParams.get('optionDate');
  const value = searchParams.get('valueDate');
  const from = searchParams.get('fromDate');
  const to = searchParams.get('toDate');
  const dateFilterObject = option ? { option, value, from, to } : null;

  try {
    // const body = await req.json();
    //const filters = body.filters as AppliedFilter[]; 
    const whereClause = {} //buildPrismaWhereClause(filters);
    const dateWhereClause = buildDatePrismaFilter(dateFilterObject);

    const data = mockDb.clients.findMany({
      select: {
        id: true,
        name_lastname: true,
        email: true,
        mobile_phone: true,
        home_phone: true,
        work_phone: true,
        credit_app_list_status_id: true,
        born_date: true,
        created_at: true,
        consent_approved: true,
        last_activity: true,
        client_status_changed_at: true,
        deposit_client: {
          select: {
            amount: true,
            id: true,
            deposit_date: true,
          },
        },
        gender: {
          select: {
            gender: true,
          },
        },
        language: {
          select: {
            language: true,
          },
        },
        client_address: {
          select: {
            street: true,
            city: true,
            county_id: true,
            state_id: true,
            zip: true,
            county: true,
            id: true,
            state: true,
          },
        },
        current_address: true,
        current_job: true,
        previous_address: true,
        previous_job: true,
        social_security: true,
        duplicate: true,
        contact_method: {
          select: {
            method: true,
          },
        },
        contact_time: {
          select: {
            id: true,
            time: true,
          },
        },
        cash_down: true,
        file: {
          select: {
            file: true,
          },
        },
        inquiry_type: {
          select: {
            type: true,
          },
        },
        lead_source: {
          select: {
            source: true,
            id: true,
          },
        },
        lead_type: {
          select: {
            type: true,
            id: true,
          },
        },
        mailing_address: true,
        other_income: true,
        reference: true,
        referrer_client: {
          select: {
            buyer: {
              select: {
                name_lastname: true,
                email: true,
                mobile_phone: true,
                current_address: true,
                id: true,
              },
            },
            referrer: {
              select: {
                name_lastname: true,
                email: true,
                mobile_phone: true,
                current_address: true,
                id: true,
              },
            },
          },
        },
        buyer_referrer: {
          select: {
            buyer: {
              select: {
                name_lastname: true,
                email: true,
                mobile_phone: true,
                current_address: true,
                id: true,
              },
            },
            referrer: {
              select: {
                name_lastname: true,
                email: true,
                mobile_phone: true,
                current_address: true,
                id: true,
              },
            },
          },
        },
        seller: {
          select: {
            name: true,
            last_name: true,
            id: true,
            email: true,
          },
        },
        bdc: {
          select: {
            name: true,
            last_name: true,
            id: true,
            email: true,
          },
        },
        sales_manager: {
          select: {
            name: true,
            last_name: true,
            id: true,
            email: true,
          },
        },
        finance_manager: {
          select: {
            name: true,
            last_name: true,
            id: true,
            email: true,
          },
        },
        deal: true,
        // created_by: {
        //   select: {
        //     name: true,
        //     last_name: true,
        //     id: true,
        //     email: true
        //   }
        // },
        interested_vehicle: {
          include: {
            vehicle_brands: true,
            vehicle_models: true,
            vehicle_manufacture_years: true,
            vehicle_identification_numbers: true,
            vehicle_prices: true,
            title_license: {
              select: {
                id: true,
                asking_price: true,
              },
            },
            general_info: {
              select: {
                id: true,
                stock_no: true,
              },
            },
            vehicle_image: { select: { id: true, path: true } },
            vehicle_mileages: true,
          },
        },
        client_status: {
          select: {
            status: true,
            id: true,
          },
        },
        message: {
          select: {
            date_sent: true,
          },
          orderBy: {
            date_sent: 'asc',
          },
        },
        appointment: true,
        first_name: true,
        last_name: true,
        suffix: true,
        salutation: true,
        middle_initials: true,
        nickname: true,
        client_lead_temperature: {
          select: {
            temperature: true,
            id: true,
          },
        },
        // note: {
        //   select: {
        //     note: true,
        //     id: true,
        //     created_at: true,
        //     created_by: {
        //       select: {
        //         name: true,
        //         last_name: true,
        //         id: true,
        //       },
        //     },
        //     from: {
        //       select: {
        //         from: true,
        //         id: true,
        //       },
        //     },
        //     client_note: {
        //       select: {
        //         name_lastname: true,
        //         email: true,
        //         id: true,
        //       },
        //     },
        //   },
        // },
        vehicle_delivery : true
      },
      orderBy: {
        created_at: 'desc',
      },
      where: {
        client_status_id: 10,
        ...whereClause,
        client_status_changed_at: dateWhereClause,
        deleted: {
          not: {
            equals: true,
          },
        },
      },
    }); 

    return NextResponse.json(data);
  } catch (error: any) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}