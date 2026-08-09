import prisma from '@/app/libs/prisma';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { getEndOfDay, getStartOfDay } from '@/app/libs/buildDatePrismaFilter';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const timeZone = searchParams.get('timezone') || 'America/Chicago';
  const now = new Date();
  const startOfTodayUTC = getStartOfDay(now, timeZone);
  const endOfTodayUTC = getEndOfDay(now, timeZone);

  try {
    const dataFromLead = await prisma.leads.findMany({
      where: {
        OR: [
          {
            credit_app_created_at: {
              gte: startOfTodayUTC,
              lte: endOfTodayUTC,
            },
          },
          {
            clients: {
              client_status_changed_at: {
                gte: startOfTodayUTC,
                lte: endOfTodayUTC,
              },
            },
            customer_status_id: CustomersStatuses.CreditApp,
          },
          {
            clients: {
              credit_app: {
                some: {
                  created_at: {
                    gte: startOfTodayUTC,
                    lte: endOfTodayUTC,
                  },
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        customer_credit_app_list_status_id: true,
        customer_credit_app_list: true,
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
            id: true,
            stock_no: true,
            vehicle_brands: {
              select: {
                id: true,
                brand: true,
              },
            },
            vehicle_models: {
              select: {
                id: true,
                model: true,
              },
            },
            vehicle_identification_numbers: {
              select: {
                id: true,
                vin: true,
              },
            },
            vehicle_manufacture_years: {
              select: {
                id: true,
                year: true,
              },
            },
          },
        },
        clients: {
          select: {
            credit_app: true,
            id: true,
            first_name: true,
            last_name: true,
            mobile_phone: true,
            appointment: {
              where: {
                status_id: {
                  in: [4, 7, 9, 10],
                },
              },
              select: {
                id: true,
                start_date: true,
                client_accept_appointment: true,
              },
            },
            // credit_app_list_status: {
            //   select: {
            //     id: true,
            //     status: true,
            //   },
            // },
          },
        },
      },
    });

    // const data = await prisma.credit_app.findMany({
    //   where: {
    //     created_at: {
    //       gte: startOfTodayUTC,
    //       lte: endOfTodayUTC,
    //     },
    //   },
    //   select: {
    //     id: true,
    //     client: {
    //       select: {
    //         credit_app: true,
    //         id: true,
    //         first_name: true,
    //         last_name: true,
    //         mobile_phone: true,
    //         seller: {
    //           select: {
    //             id: true,
    //             name: true,
    //             last_name: true,
    //             username: true,
    //           },
    //         },
    //         appointment: {
    //           where: {
    //             status_id: {
    //               in: [4, 7, 9, 10],
    //             },
    //           },
    //           select: {
    //             id: true,
    //             start_date: true,
    //             client_accept_appointment: true,
    //           },
    //         },
    //         interested_vehicle: {
    //           select: {
    //             id: true,
    //             vehicle_brands: {
    //               select: {
    //                 id: true,
    //                 brand: true,
    //               },
    //             },
    //             vehicle_models: {
    //               select: {
    //                 id: true,
    //                 model: true,
    //               },
    //             },
    //             vehicle_identification_numbers: {
    //               select: {
    //                 id: true,
    //                 vin: true,
    //               },
    //             },
    //             vehicle_manufacture_years: {
    //               select: {
    //                 id: true,
    //                 year: true,
    //               },
    //             },
    //           },
    //         },
    //         credit_app_list_status: {
    //           select: {
    //             id: true,
    //             status: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    // const data = await prisma.appointments.findMany({
    //   where: {
    //     start_date: {
    //       gte: startOfToday(),
    //       lte: endOfToday(),
    //     },
    //     AND: {
    //       status_id: 2,
    //     },
    //   },
    //   include: {
    //     customers: {
    //       select: {
    //         first_name: true,
    //         last_name: true,
    //         mobile_phone: true,
    //         email: true,
    //         id: true,
    //         interested_vehicle: {
    //           select: {
    //             vehicle_brands: {
    //               select: {
    //                 brand: true,
    //               },
    //             },
    //             vehicle_models: {
    //               select: {
    //                 model: true,
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //     users: {
    //       select: {
    //         name: true,
    //         last_name: true,
    //       },
    //     },
    //   },
    // });

    //await prisma.$disconnect();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(dataFromLead);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Sever Error' }, { status: 500 });
  }
}
