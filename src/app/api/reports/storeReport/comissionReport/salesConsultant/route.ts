import prisma from '@/app/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { DefaultRoles } from '../../../bdcLog/types';
import { buildDateRangeFilter } from '@/app/libs/monthAndYearDateFilter';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';
import { ComissionSalesRepSummary } from '../types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    const prismaDateFilter = buildDateRangeFilter(startDate, endDate);

    const users = await prisma.users.findMany({
      // where: {
      //   user_has: {
      //     some: {
      //       role_id: DefaultRoles.SalesRep,
      //     },
      //   },
      // },
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

    const leads = await prisma.leads.findMany({
      where: {
        customer_status_id: {
          in: [CustomersStatuses.Sold, CustomersStatuses.Funded],
        },
        end_at: prismaDateFilter,
      },
      select: {
        sales_rep_id: true,
        isSplitSold: true,
        sellersInSplitDeal: {
          select: {
            id: true,
          },
        },
      },
    });

    const comissionSummaryMap = new Map<number, ComissionSalesRepSummary>();
    const temporalComission = new Map<number, string>();

    users.forEach((user) => {
      if (!comissionSummaryMap.has(user.id)) {
        const salesRepName = user.name;
        const salesRepLastname = user.last_name;
        const salesRepUsername = user.username;
        const salesConsultantId = user.id;
        const salesConsultant = `${salesRepName} ${salesRepLastname}${
          salesRepUsername ? ` - ${salesRepUsername}` : ''
        }`;

        let bonus = '0';
        let salary = '0';
        let spiff = '0';

        user.comissionInfo?.bonus.forEach((el) => {
          bonus = el.amount.plus(bonus).toString();
        });

        user.comissionInfo?.salary.forEach((el) => {
          salary = el.amount.plus(salary).toString();
        });

        user.comissionInfo?.spiff.forEach((el) => {
          spiff = el.amount.plus(spiff).toString();
        });

        temporalComission.set(user.id, user.pay_plan?.of_cash_down?.toString() || '0');

        // if (user.user_has[0].role_id === DefaultRoles.SalesRep) {
        comissionSummaryMap.set(user.id, {
          bonus,
          comission: '0',
          salary,
          sales: 0,
          spiff,
          salesConsultant,
          salesConsultantId,
        });
        // }
      }
    });

    leads.forEach((lead) => {
      if (lead.sales_rep_id) {
        const mappedData = comissionSummaryMap.get(lead.sales_rep_id);

        if (mappedData) {
          mappedData.sales += lead.isSplitSold ? 0.5 : 1;

          // const comissionTotal = Number(mappedData.comission) * mappedData.sales;

          const temporalMappedComission = temporalComission.get(lead.sales_rep_id) || '0';

          const comissionTotal = Number(temporalMappedComission) * mappedData.sales;

          mappedData.comission = comissionTotal.toString();
        }

        if (lead.isSplitSold && lead.sellersInSplitDeal.length > 0) {
          lead.sellersInSplitDeal.forEach((splittedSoldCustomer) => {
            const splittedMappedDate = comissionSummaryMap.get(splittedSoldCustomer.id);

            if (splittedMappedDate) {
              splittedMappedDate.sales += 0.5;

              // const comissionTotal =
              //   Number(splittedMappedDate.comission) * splittedMappedDate.sales;

              const temporalMappedComission = temporalComission.get(splittedSoldCustomer.id) || '0';

              const comissionTotal = Number(temporalMappedComission) * splittedMappedDate.sales;

              splittedMappedDate.comission = comissionTotal.toString();
            }
          });
        }
      }
    });

    const comissionSummary = Array.from(comissionSummaryMap.values());

    return NextResponse.json(comissionSummary);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
