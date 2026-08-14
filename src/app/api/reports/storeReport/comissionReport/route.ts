import { mockDb } from '@/app/libs/mock-db';
import { NextRequest, NextResponse } from 'next/server';
import { DefaultRoles } from '../../bdcLog/types';
import { buildDateRangeFilter } from '@/app/libs/monthAndYearDateFilter';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';

export const dynamic = 'force-dynamic';

interface TemporalSummary {
  sales: number;
  comission: string;
  spiff: string;
  bonus: string;
  salary: string;
  representative: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    const prismaDateFilter = buildDateRangeFilter(startDate, endDate);

    const users = mockDb.users.findMany({
      where: {
        user_has: {
          some: {
            role_id: { in: [DefaultRoles.SalesRep, DefaultRoles.Bdc] },
          },
        },
      },
      select: {
        id: true,
        name: true,
        last_name: true,
        username: true,
        user_has: {
          select: {
            role_id: true,
          },
        },
        pay_plan: {
          select: {
            of_cash_down: true,
          },
        },
        comissionInfo: {
          select: {
            bonus: {
              select: {
                amount: true,
              },
            },
            salary: {
              select: {
                amount: true,
              },
            },
            spiff: {
              select: {
                amount: true,
              },
            },
          },
        },
      },
    });

    const leads = mockDb.leads.findMany({
      where: {
        customer_status_id: {
          in: [CustomersStatuses.Sold, CustomersStatuses.Funded],
        },
        end_at: prismaDateFilter,
      },
      select: {
        sales_rep_id: true,
      },
    });

    const comissionSummaryMap = new Map<number, TemporalSummary>();

    users.forEach((user) => {
      if (!comissionSummaryMap.has(user.id)) {
        const repName = user.name;
        const repLastname = user.last_name;
        const repUsername = user.username;
        const representative = `${repName} ${repLastname}${repUsername ? ` - ${repUsername}` : ''}`;

        let bonus = '0';
        let salary = '0';
        let spiff = '0';

        user.comissionInfo?.bonus.forEach((el: any) => {
          bonus = el.amount.plus(bonus).toString();
        });

        user.comissionInfo?.salary.forEach((el: any) => {
          salary = el.amount.plus(salary).toString();
        });

        user.comissionInfo?.spiff.forEach((el: any) => {
          spiff = el.amount.plus(spiff).toString();
        });

        if (user.user_has[0].role_id === DefaultRoles.SalesRep) {
          comissionSummaryMap.set(user.id, {
            bonus,
            comission: '',
            salary,
            sales: 0,
            spiff,
            representative,
          });
        }
      }
    });

    leads.forEach((lead) => {
      if (lead.sales_rep_id) {
        const mappedData = comissionSummaryMap.get(lead.sales_rep_id);

        if (mappedData) {
        }
      }
    });

    return NextResponse.json([]);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
