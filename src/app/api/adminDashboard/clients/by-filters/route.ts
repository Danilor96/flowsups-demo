import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { buildPrismaWhereClause } from './convertToPrismaFilters';
import { buildDatePrismaFilter } from '@/app/libs/buildDatePrismaFilter';
import { auth } from '@/auth';
import { serverCan } from '@/app/libs/functions/permissions/permissions.functions';
import { mockDb } from '@/app/libs/mock-db';
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

  const whereCondition: Record<string, any> = {};

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

    const data = await mockDb.clients.findMany({
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

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error: any) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
