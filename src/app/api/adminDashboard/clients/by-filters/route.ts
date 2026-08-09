import prisma from '@/app/libs/prisma';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { buildPrismaWhereClause } from './convertToPrismaFilters';
import { buildDatePrismaFilter } from '@/app/libs/buildDatePrismaFilter';
import { auth } from '@/auth';
import { serverCan } from '@/app/libs/functions/permissions/permissions.functions';
import { Prisma } from '@prisma/client';
import { Permissions } from '@/app/libs/definitions/permissions/permissions';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';

export async function POST(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const option = searchParams.get('optionDate');
  const value = searchParams.get('valueDate');
  const from = searchParams.get('fromDate');
  const to = searchParams.get('toDate');
  const dateFilterObject = option ? { option, value, from, to } : null;
  const excludeClientStatus = searchParams.get('excludeClientStatus');
  const excludeClientStatusArray = excludeClientStatus
    ? excludeClientStatus.split(',').map(Number)
    : [];

  const optionDefault = searchParams.get('optionDefaultDate');
  const valueDefault = searchParams.get('valueDefaultDate');
  const fromDefault = searchParams.get('fromDefaultDate');
  const toDefault = searchParams.get('toDefaultDate');

  const timeZone = searchParams.get('timeZone');

  const defaultDateFilterObject = optionDefault
    ? { option: optionDefault, value: valueDefault, from: fromDefault, to: toDefault }
    : null;

  const defaultDateWhereClause = buildDatePrismaFilter(
    defaultDateFilterObject,
    timeZone || undefined,
  );

  const session = await auth();

  const userId = Number(session?.user.id);

  const whereCondition: Prisma.ClientsWhereInput = {};

  const hasViewAllPermission = await serverCan({
    requiredPermissions: Permissions.CustomerViewAnyCustomer,
  });

  if (!hasViewAllPermission ) {
    whereCondition.OR = [
      { seller_id: userId },
      { bdc_id: userId },
      { sales_manager_id: userId },
      { finance_manager_id: userId },
      { 
        client_status_id: CustomersStatuses.New
      }
    ];
  }

  try {
    const body = await req.json();
    const filters = body.filters as AppliedFilter[];
    const userIdParam = req.nextUrl.searchParams.get('userId');
    const whereClause = buildPrismaWhereClause(filters);
    const dateWhereClause = buildDatePrismaFilter(dateFilterObject, timeZone || undefined);

    let userFilter = {};
    if (userIdParam) {
      const userId = parseInt(userIdParam);
      if (!isNaN(userId)) {
        userFilter = {
          OR: [
            {
              seller_id: userId,
            },
            {
              bdc_id: userId,
            },
            {
              sales_manager_id: userId,
            },
            {
              finance_manager_id: userId,
            },
          ],
        };
      }
    }

    const data = await prisma?.clients.findMany({
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
        note: {
          select: {
            note: true,
            id: true,
            created_at: true,
            created_by: {
              select: {
                name: true,
                last_name: true,
                id: true,
              },
            },
            from: {
              select: {
                from: true,
                id: true,
              },
            },
            client_note: {
              select: {
                name_lastname: true,
                email: true,
                id: true,
              },
            },
          },
        },
        lead: {
          where: {
            is_active: true,
          },
          select: {
            id: true,
            customer_status: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      where: {
        ...whereClause,
        ...userFilter,
        ...{ created_at: defaultDateWhereClause },
        ...whereCondition,
        usersRelated: dateFilterObject
          ? {
              some: {
                created_at: dateWhereClause,
                user_id: hasViewAllPermission
                  ? userIdParam
                    ? {
                        equals: parseInt(userIdParam),
                      }
                    : undefined
                  : userId,
              },
            }
          : undefined,
        client_status_id: excludeClientStatus
          ? {
              notIn: excludeClientStatusArray,
            }
          : undefined,
        // credit_app_other_income: {
        //   some: {
        //     // necesito castearlo a number
        //     income_amount: {
        //       mode: '',
        //     }
        //   }
        // },
        deleted: {
          not: {
            equals: true,
          },
        },
      },
    });

    //await prisma?.$disconnect();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error: any) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
