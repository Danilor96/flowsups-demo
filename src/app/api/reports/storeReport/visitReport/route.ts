import prisma from '@/app/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { VisitReportData } from './types';
import { buildDatePrismaFilter } from '@/app/libs/buildDatePrismaFilter';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const option = searchParams.get('optionDate');
  const value = searchParams.get('valueDate');
  const from = searchParams.get('fromDate');
  const to = searchParams.get('toDate');

  const dateFilterObject = option ? { option, value, from, to } : null;

  try {
    const dateWhereClause = buildDatePrismaFilter(dateFilterObject);

    const visitData = await prisma.daily_visit_history.findMany({
      where: {
        created_at: dateWhereClause,
      },
      select: {
        id: true,
        created_at: true,
        decision_id: true,
        note: {
          select: {
            note: true,
          },
        },
      },
    });

    const leads = await prisma.leads.findMany({
      where: {
        daily_visit_history: {
          some: {},
        },
      },
      select: {
        customer_status: {
          select: {
            status: true,
          },
        },
        daily_visit_history: {
          select: {
            id: true,
            sales_rep: {
              select: {
                id: true,
                name: true,
                last_name: true,
                username: true,
              },
            },
            vehicle: {
              select: {
                vehicle_brands: {
                  select: {
                    brand: true,
                  },
                },
                vehicle_models: {
                  select: {
                    model: true,
                  },
                },
                vehicle_identification_numbers: {
                  select: {
                    vin: true,
                  },
                },
                vehicle_manufacture_years: {
                  select: {
                    year: true,
                  },
                },
              },
            },
          },
        },
        clients: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            home_phone: true,
            mobile_phone: true,
            email: true,
            lead_source: {
              select: {
                source: true,
              },
            },
          },
        },
      },
    });

    //await prisma.$disconnect();

    const reportDataMap = new Map<number, VisitReportData>();

    visitData.forEach((visit) => {
      const visitId = visit.id;

      if (!reportDataMap.get(visitId)) {
        reportDataMap.set(visitId, {
          visitDate: visit.created_at,
          customerName: '',
          homePhone: '',
          cellPhone: '',
          email: '',
          salesRepName: '',
          interestedVehicle: {
            brand: '',
            model: '',
            vin: '',
            year: '',
          },
          source: '',
          comments: visit.note?.note || '',
          customerId: 0,
          customerStatus: '',
          salesRepId: 0,
        });
      }
    });

    leads.forEach((lead) => {
      const visitHistory = lead.daily_visit_history;

      visitHistory.forEach((visit) => {
        const visitId = visit.id;

        if (visitId) {
          const dataMapped = reportDataMap.get(visitId);

          if (dataMapped) {
            const customerFirstName = lead.clients.first_name || '';
            const customerLastName = lead.clients.last_name || '';

            const customerName = `${customerFirstName} ${customerLastName}`;
            const homePhone = lead.clients.home_phone || '';
            const cellPhone = lead.clients.mobile_phone || '';
            const email = lead.clients.email || '';
            const source = lead.clients.lead_source?.source || '';
            const customerId = lead.clients.id;
            const customerStatus = lead.customer_status?.status || '';

            dataMapped.customerName = customerName;
            dataMapped.homePhone = homePhone;
            dataMapped.cellPhone = cellPhone;
            dataMapped.email = email;
            dataMapped.source = source;
            dataMapped.customerId = customerId;
            dataMapped.customerStatus = customerStatus;

            const salesRepFirstName = visit?.sales_rep?.name || '';
            const salesRepLastName = visit?.sales_rep?.last_name || '';
            const salesRepUsername = visit?.sales_rep?.username || '';
            const salesRepId = visit?.sales_rep?.id;
            const salesRepName = `${salesRepFirstName} ${salesRepLastName}${
              salesRepUsername ? ` - ${salesRepUsername}` : ''
            }`;

            dataMapped.salesRepId = salesRepId || 0;
            dataMapped.salesRepName = salesRepName;

            const interestedVehicle = {
              model: visit?.vehicle?.vehicle_models.model || '',
              brand: visit?.vehicle?.vehicle_brands.brand || '',
              year: visit?.vehicle?.vehicle_manufacture_years?.year || '',
              vin: visit?.vehicle?.vehicle_identification_numbers.vin || '',
            };

            dataMapped.interestedVehicle = interestedVehicle;
          }
        }
      });
    });

    const reportData = Array.from(reportDataMap.values());

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(reportData);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
