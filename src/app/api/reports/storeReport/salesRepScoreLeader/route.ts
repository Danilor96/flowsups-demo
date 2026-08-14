import { buildDatePrismaFilter } from '@/app/libs/buildDatePrismaFilter';
import { mockDb, Decimal } from '@/app/libs/mock-db';
import { ActivityType } from '@/app/libs/services/salesPointsService';
import { NextRequest, NextResponse } from 'next/server';
import { FundingStatuses } from '@/app/libs/customer/customersFunctions';
import { buildDateRangeFilter } from '@/app/libs/monthAndYearDateFilter';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');


  try {
    const dateWhereClause = buildDateRangeFilter(startDate, endDate);

    const businessConfig = mockDb.salesGoalsConfig.findFirst();

    const users = mockDb.users.findMany({
      select: {
        id: true,
        name: true,
        last_name: true,
        username: true,
        sales_points_today: true,
        sales_points_total: true,
        daily_points_target: true,
        monthly_vehicle_sales_goal: true,
        client_seller: {
          select: {
            id: true,
            client_status_id: true
          },
          where: {
            client_status_id: {
              // Exclude clients with status 10 and 12 sold, lost
              notIn: [10, 12]
            }
          },          
        },
        client_sales_manager: {
          select: {
            id: true,
            client_status_id: true
          },
          where: {
            client_status_id: {
              // Exclude clients with status 10 and 12 sold, lost
              notIn: [10, 12]
            }
          },          
        },
        monthly_goals: {
          where: {
            date_month: dateWhereClause,
          },
          select: {
            id: true,
            sales_goal: true,
          },
        }
      },
    });
    console.log({dateWhereClause})
    const soldLeadsByUser = mockDb.leads.findMany({
      where: {
        sold_created_at: dateWhereClause,
        customer_status_id: {
          in: [10, 11] // sold, funding
        },
        OR: [
          { customer_funding_list_status_id: null },
          {
            customer_funding_list_status_id: {
              not: FundingStatuses.Returned
            }
          },
          { customer_funding_returned_at: null },
          // CASO 2: Se retornó, pero NO en este mes (ej. en un mes futuro)
          {
            customer_funding_returned_at: { gt: dateWhereClause.lte }
          }
        ]
      },
      include: {
        sellersInSplitDeal: true
      }
    });

    const soldLeadsCountByUser = soldLeadsByUser.reduce((acc: Map<string, number>, lead) => {
      if (!lead.sales_rep_id) return acc;
      
      const salesRepId = lead.sales_rep_id.toString();
      const isSplitSold = lead.isSplitSold;
      if (isSplitSold) {
        const sellersInSplitDeal = lead.sellersInSplitDeal;
        sellersInSplitDeal.forEach((seller: any) => {
          const sellerId = seller.id.toString();
          const sellerCount = acc.get(sellerId) || 0;
          acc.set(sellerId, sellerCount + 0.5);
        });
      } else {
        const sellerCount = acc.get(salesRepId) || 0;
        acc.set(salesRepId, sellerCount + 1);
      }
      return acc;
    }, new Map<string, number>());

    const deals = mockDb.deal.findMany({
      where: {
        created_at: dateWhereClause,
      },
    });

    // Process the Results into a Useful Format
    const report: Record<
      number,
      {
        userId: number;
        user: {
          id: number;
          name: string | null;
          last_name: string | null;
          username: string | null;
          sales_points_today: number;
          sales_points_total: number;
          daily_points_target: number | null;
          monthly_vehicle_sales_goal: number | null;
          monthly_goals: {
            id: number;
            sales_goal: number;
          }[];
        } | null;
        sold_leads: number;
        active_leads: number;
        businessSalesGoalsConfig: number | null | undefined;
        frontend: Decimal;
        backend: Decimal;
        total: Decimal;
      }
    > = {};

    
    users.forEach(user => {
      const user_id = user.id;
     
      let frontend = Decimal(0);
      let backend = Decimal(0);
      deals.forEach(deal => {
        if (deal.seller_id === user_id) {
          if (deal.frontend) {
            frontend = frontend.add(deal.frontend);
          }
          if (deal.backend) {
            backend = backend.add(deal.backend);
          }
        }
      });
      report[user_id] = {
        userId: user_id,
        user: user,
        sold_leads: soldLeadsCountByUser.get(user_id.toString()) || 0,
        active_leads: (user?.client_seller?.length || 0) + (user?.client_sales_manager?.length  || 0 ),
        businessSalesGoalsConfig: businessConfig?.dailySalesPointsTarget,
        frontend: frontend,
        backend: backend,
        total: frontend.add(backend),     
        };
    });

    return NextResponse.json({
      activityCounts: Object.values(report),
      businessSalesGoalsConfig: businessConfig,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
