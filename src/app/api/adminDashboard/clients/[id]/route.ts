import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { Roles } from '../../dailyCalls/types';
import { buildDatePrismaFilter } from '@/app/libs/buildDatePrismaFilter';
import { mockDb } from '@/app/libs/mock-db';
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

  const whereCondition: Record<string, any> = {};

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
    const data = await mockDb.clients.findMany({
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

    return NextResponse.json(sortedData);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
