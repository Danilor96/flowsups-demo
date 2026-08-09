import { buildDatePrismaFilter } from '@/app/libs/buildDatePrismaFilter';
import prisma from '@/app/libs/prisma';
import { ActivityType } from '@/app/libs/services/salesPointsService';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const option = searchParams.get('optionDate');
  const value = searchParams.get('valueDate');
  const from = searchParams.get('fromDate');
  const to = searchParams.get('toDate');

  const dateFilterObject = option ? { option, value, from, to } : null;


  try {
    const dateWhereClause = buildDatePrismaFilter(dateFilterObject);

    const businessConfig = await prisma.salesGoalsConfig.findFirst();
    const activityCounts = await prisma.sales_activity_log.groupBy({
      by: ['user_id', 'activity_type'], // Agrupamos por vendedor y tipo de actividad
      _count: {
        id: true,
      },
      where: {
        created_at: dateWhereClause,
      },
    });

    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        last_name: true,
        username: true,
        sales_points_today: true,
        sales_points_total: true,
        daily_points_target: true,
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
      },
      
    });

    const userHasClients = await prisma.clients.findMany({
      select: {
        id: true,
        seller_id: true,
        sales_manager_id: true,
      },
      where: {
        
      },
    })

    const deals = await prisma.deal.findMany({
      where: {
        created_at: dateWhereClause,
      },
    });
        

    // Process the Results into a Useful Format
    const report: Record<
      number,
      {
        userId: number;
        activities: Record<ActivityType, number>;
        user: {
          id: number;
          name: string | null;
          last_name: string | null;
          username: string | null;
          sales_points_today: number;
          sales_points_total: number;
          daily_points_target: number | null;
        } | null;
        active_leads: number;
        businessSalesGoalsConfig: number | null | undefined;
        frontend: number;
        backend: number;
        total: number;
      }
    > = {};

    for (const item of activityCounts) {
      const { user_id, activity_type, _count } = item;
     
      let frontend = Prisma.Decimal(0);
      let backend = Prisma.Decimal(0);
      deals.forEach(deal => {
        if (deal.seller_id === user_id) {
          if (deal.frontend) {
            frontend = frontend.add(deal.frontend)
          }
          if (deal.backend) {
            backend = backend.add(deal.backend)
          }
        }
      });

      if (!report[user_id]) {
        const user = users.find(user => user.id === user_id) || null
        report[user_id] = {
          userId: user_id,
          activities: {} as Record<ActivityType, number>,
          user: user,
          active_leads: (user?.client_seller?.length || 0) + (user?.client_sales_manager?.length  || 0 ),
          businessSalesGoalsConfig: businessConfig?.dailySalesPointsTarget,
          frontend: frontend.toNumber(),
          backend: backend.toNumber(),
          total: frontend.add(backend).toNumber(),          
        };
      }
      report[user_id].activities[activity_type] = _count.id;
    }

    //await prisma.$disconnect();

    return NextResponse.json({
      activityCounts: Object.values(report),
      businessSalesGoalsConfig: businessConfig,
    });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
