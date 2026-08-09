import prisma from '@/app/libs/prisma';
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { Roles } from '../../dailyCalls/types';
import { buildDatePrismaFilter } from '@/app/libs/buildDatePrismaFilter';
import { Prisma } from '@prisma/client';
import { Permissions } from '@/app/libs/definitions/permissions/permissions';
import { serverCan } from '@/app/libs/functions/permissions/permissions.functions';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const clientStatusId = parseInt(params.id);

  const session = await auth();

  const userId = session?.user.id;

  const { searchParams } = request.nextUrl;

  const timeZone = searchParams.get('timeZone');

  const optionDefault = searchParams.get('optionDefaultDate');
  const valueDefault = searchParams.get('valueDefaultDate');
  const fromDefault = searchParams.get('fromDefaultDate');
  const toDefault = searchParams.get('toDefaultDate');

  const optionActivity = searchParams.get('optionActivityDate');
  const valueActivity = searchParams.get('valueActivityDate');
  const fromActivity = searchParams.get('fromActivityDate');
  const toActivity = searchParams.get('toActivityDate');

  const optionVisit = searchParams.get('optionVisitDate');
  const valueVisit = searchParams.get('valueVisitDate');
  const fromVisit = searchParams.get('fromVisitDate');
  const toVisit = searchParams.get('toVisitDate');

  const optionDeposit = searchParams.get('optionDepositDate');
  const valueDeposit = searchParams.get('valueDepositDate');
  const fromDeposit = searchParams.get('fromDepositDate');
  const toDeposit = searchParams.get('toDepositDate');

  const optionLost = searchParams.get('optionLostDate');
  const valueLost = searchParams.get('valueLostDate');
  const fromLost = searchParams.get('fromLostDate');
  const toLost = searchParams.get('toLostDate');

  const optionSold = searchParams.get('optionSoldDate');
  const valueSold = searchParams.get('valueSoldDate');
  const fromSold = searchParams.get('fromSoldDate');
  const toSold = searchParams.get('toSoldDate');

  const optionDelivery = searchParams.get('optionDeliveryDate');
  const valueDelivery = searchParams.get('valueDeliveryDate');
  const fromDelivery = searchParams.get('fromDeliveryDate');
  const toDelivery = searchParams.get('toDeliveryDate');

  const optionDaysIn = searchParams.get('optionDaysInDate');
  const valueDaysIn = searchParams.get('valueDaysInDate');
  const fromDaysIn = searchParams.get('fromDaysInDate');
  const toDaysIn = searchParams.get('toDaysInDate');
  const lostReasonId = searchParams.get('lostReasonId');

  const visitDateFilterObject = optionVisit
    ? { option: optionVisit, value: valueVisit, from: fromVisit, to: toVisit }
    : null;

  const depositDateFilterObject = optionDeposit
    ? { option: optionDeposit, value: valueDeposit, from: fromDeposit, to: toDeposit }
    : null;

  const lostDateFilterObject = optionLost
    ? { option: optionLost, value: valueLost, from: fromLost, to: toLost }
    : null;

  const soldDateFilterObject = optionSold
    ? { option: optionSold, value: valueSold, from: fromSold, to: toSold }
    : null;

  const deliveryDateFilterObject = optionDelivery
    ? { option: optionDelivery, value: valueDelivery, from: fromDelivery, to: toDelivery }
    : null;

  const daysInDateFilterObject = optionDaysIn
    ? { option: optionDaysIn, value: valueDaysIn, from: fromDaysIn, to: toDaysIn }
    : null;

  const activityDateFilterObject = optionActivity
    ? { option: optionActivity, value: valueActivity, from: fromActivity, to: toActivity }
    : null;

  const defaultDateFilterObject = optionDefault
    ? { option: optionDefault, value: valueDefault, from: fromDefault, to: toDefault }
    : null;

  const defaultDateWhereClause = buildDatePrismaFilter(
    defaultDateFilterObject,
    timeZone || undefined,
  );
  const visitDateWhereClause = buildDatePrismaFilter(visitDateFilterObject, timeZone || undefined);
  const depositDateWhereClause = buildDatePrismaFilter(
    depositDateFilterObject,
    timeZone || undefined,
  );
  const lostDateWhereClause = buildDatePrismaFilter(lostDateFilterObject, timeZone || undefined);
  const soldDateWhereClause = buildDatePrismaFilter(soldDateFilterObject, timeZone || undefined);
  const deliveryDateWhereClause = buildDatePrismaFilter(
    deliveryDateFilterObject,
    timeZone || undefined,
  );
  const daysInDateWhereClause = buildDatePrismaFilter(
    daysInDateFilterObject,
    timeZone || undefined,
  );
  const activityDateWhereClause = buildDatePrismaFilter(
    activityDateFilterObject,
    timeZone || undefined,
  );

  const whereCondition: Prisma.ClientsWhereInput = {};

  const canAllClients = await serverCan({
    requiredPermissions: Permissions.CustomerViewAnyCustomer,
  });

  if (!canAllClients && clientStatusId !== CustomersStatuses.New) {
    whereCondition.seller_id = userId;
  }

  if (lostReasonId) {
    whereCondition.lost_reason_id = { in: lostReasonId.split(',').map(Number) };
  }

  try {
    const data = await prisma.clients.findMany({
      select: {
        id: true,
        lost_reason_id: true,
        lost_date: true,
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
        funding_list_status_id: true,
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
        interested_vehicle: {
          select: {
            id: true,
            stock_no: true,
            vehicle_brands: true,
            vehicle_models: true,
            vehicle_manufacture_years: true,
            vehicle_identification_numbers: true,
            vehicle_status: true,
          },
        },
        vehicle_delivery: {
          select: {
            id: true,
            end_date: true,
            start_date: true,
            vehicle: {
              select: {
                id: true,
                vehicle_brands: true,
                vehicle_models: true,
                vehicle_manufacture_years: true,
                vehicle_identification_numbers: true,
              },
            },
          },
        },
        client_status: {
          select: {
            status: true,
            id: true,
          },
        },
        client_status_changed_at: true,
        deposit_client: {
          select: {
            amount: true,
            id: true,
            deposit_date: true,
            reference: true,
            non_refundable: true,
            vehicle:
              clientStatusId === CustomersStatuses.Deposit
                ? {
                    select: {
                      id: true,
                      stock_no: true,
                      vehicle_brands: true,
                      vehicle_models: true,
                      vehicle_manufacture_years: true,
                      vehicle_identification_numbers: true,
                    },
                  }
                : undefined,
          },
          orderBy: {
            deposit_date: 'asc',
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
        deal: {
          orderBy: {
            created_at: 'asc',
          },
          include: {
            bank: true,
          },
          // where: {
          //   lead: {
          //     is_active: true,
          //   },
          // },
        },
        lead: {
          where: {
            is_active: true,
          },
          select: {
            id: true,
            sold_created_at: true,
            funding_created_at: true,
            customer_funding_list_status_id: true,
            isSplitSold: true,
            sellersInSplitDeal: {
              select: {
                id: true,
                name: true,
                last_name: true,
              },
            },
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
      },
      orderBy: {
        created_at: 'desc',
      },
      where: {
        lead: {
          some: {
            is_active: true,
            customer_status_id: clientStatusId,
            ...(soldDateWhereClause ? { sold_created_at: soldDateWhereClause } : {}),
          },
        },
        // client_status_id: clientStatusId,
        ...{ created_at: defaultDateWhereClause },
        ...(visitDateWhereClause
          ? {
              daily_visit_history: {
                some: {
                  created_at: visitDateWhereClause,
                },
              },
            }
          : {}),
        ...(depositDateWhereClause
          ? {
              deposit_client: {
                some: {
                  deposit_date: depositDateWhereClause,
                },
              },
            }
          : {}),
        ...{
          lost_date: lostDateWhereClause,
        },
        // ...(soldDateWhereClause
        //   ? {
        //       lead: {
        //         some: {
        //           sold_created_at: soldDateWhereClause,
        //         },
        //       },
        //     }
        //   : {}),
        ...(deliveryDateWhereClause
          ? {
              vehicle_delivery: {
                some: {
                  start_date: deliveryDateWhereClause,
                },
              },
            }
          : {}),
        ...{
          client_status_changed_at: daysInDateWhereClause,
        },
        ...{
          last_activity: activityDateWhereClause,
        },
        ...whereCondition,
      },
    });

    let sortedData = data;
    if (clientStatusId === 10) {
      sortedData = [...data].sort((a, b) => {
        const hasDealA = a.deal && a.deal.length > 0;
        const hasDealB = b.deal && b.deal.length > 0;

        if (!hasDealA && hasDealB) return -1;
        if (hasDealA && !hasDealB) return 1;

        const aDate = a.lead?.[0]?.sold_created_at;
        const bDate = b.lead?.[0]?.sold_created_at;

        if (!aDate && !bDate) return 0;
        if (!aDate) return 1;
        if (!bDate) return -1;

        return new Date(bDate).getTime() - new Date(aDate).getTime();
      });
    }

    //await prisma.$disconnect();

    return NextResponse.json(sortedData);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
