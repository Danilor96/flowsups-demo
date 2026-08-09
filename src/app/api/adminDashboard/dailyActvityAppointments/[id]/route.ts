import { createNotification } from '@/app/libs/notifications/notifications';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { startOfDay, endOfDay, addHours } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createEvent } from '@/app/libs/events/events';
import { auth } from '@/auth';
import { checkPermissions } from '@/app/libs/auth-helpers';
import { Roles } from '../../dailyCalls/types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();

  const userRoleId = session?.user.user_has[0]?.role_id;

  const userId = session?.user.id;

  try {
    const { searchParams } = new URL(request.url);
    const timeZone = searchParams.get('timezone');
    const todayDateFromClient = params.id.replaceAll('-', '/');

    let startDate: Date;
    let endDate: Date;

    if (timeZone) {
      const [month, day, year] = todayDateFromClient.split('/');
      const isoDate = `${year}-${month}-${day}`;
      startDate = fromZonedTime(`${isoDate}T00:00:00.000`, timeZone);
      endDate = fromZonedTime(`${isoDate}T23:59:59.999`, timeZone);
      console.log('Fechas sin timezone: ', {
        startDate: startOfDay(todayDateFromClient),
        endDate: endOfDay(todayDateFromClient),
      });
      console.log('-> usando timezone : ', {
        startDate,
        endDate,
      });
    } else {
      startDate = startOfDay(todayDateFromClient);
      endDate = endOfDay(todayDateFromClient);
    }

    const adminRoles = [
      Roles.Superuser,
      Roles.Administrator,
      Roles.SalesManager,
      Roles.FinanceManager,
    ];

    const data = await prisma.appointments.findMany({
      where: {
        start_date: {
          gte: startDate,
          lte: endDate,
        },
        ...(userRoleId && !adminRoles.includes(userRoleId)
          ? {
              user_id: userId,
            }
          : null),
        OR: [
          {
            status_id: 5,
          },
          {
            status_id: 1,
          },
          {
            status_id: 6,
          },
          {
            status_id: 2,
          },
          {
            status_id: 3,
          },
          {
            status_id: 7,
          },
        ],
        // AND: {
        //   customers: {
        //     client_status_id: {
        //       not: 10,
        //     },
        //   },
        // },
      },
      include: {
        customers: {
          select: {
            first_name: true,
            last_name: true,
            mobile_phone: true,
            home_phone: true,
            home_default: true,
            work_phone: true,
            client_address: {
              select: {
                street: true,
                city: true,
                state: true,
                zip: true,
                county: true,
              },
            },
            appointment_confirmation_sms_sent: true,
            email: true,
            id: true,
            client_status_id: true,
            interested_vehicle: {
              select: {
                id: true,
                vehicle_brands: true,
                vehicle_models: true,
                vehicle_manufacture_years: true,
                vehicle_identification_numbers: true,
              },
            },
            bdc: {
              select: {
                id: true,
                name: true,
                last_name: true,
              },
            },
            finance_manager: {
              select: {
                id: true,
                name: true,
                last_name: true,
              },
            },
            sales_manager: {
              select: {
                id: true,
                name: true,
                last_name: true,
              },
            },
            daily_visit_history: {
              select: {
                id: true,
                decision: true,
              },
            },
            lead_type: {
              select: {
                id: true,
                type: true,
              },
            },
          },
        },
        users: {
          select: {
            name: true,
            last_name: true,
          },
        },
        appointments_status: {
          select: {
            status: true,
          },
        },
      },
      orderBy: {
        start_date: 'asc',
      },
    });

    //await prisma.$disconnect();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions([2, 72]);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const appointmentId = parseInt(params.id);

  const session = await auth();

  const userId = session?.user.id;

  const formData = await request.formData();

  const appointmentSchema = z.object({
    action: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = appointmentSchema.safeParse({
    action: formData.get('action'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { action } = validatedData.data;

  try {
    if (action === '2') {
      const data = await prisma.appointments.update({
        where: {
          id: appointmentId,
        },
        data: {
          status_id: 5,
        },
        include: {
          customers: true,
        },
      });

      const message = `The customer ${data.customers.first_name} ${data.customers.last_name} has arrived`;
      //
      await createNotification({
        message: message,
        notificationType: {
          general: true,
        },
        assignedToId: data.user_id,
        customerId: data.customer_id,
        notificationsForManagers: true,
        eventTypeId: 3,
      });

      const description = 'Customer arrived to the store';

      const customerId = data.customers.id;

      userId && (await createEvent(description, userId, customerId));

      //await prisma.$disconnect();
    }

    return NextResponse.json({ successMessage: 'Appointment Successfully Changed' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions([72]);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const customerId = parseInt(params.id);

  const formData = await request.formData();

  const visitEschema = z.object({
    now: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = visitEschema.safeParse({
    now: formData.get('now'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { now } = validatedData.data;

  const session = await auth();

  const userId = session?.user.id;

  try {
    if (userId) {
      const data = await prisma.appointments.create({
        data: {
          start_date: now,
          end_date: addHours(now, 2),
          customer_id: customerId,
          created_by: userId,
          status_id: 5,
          user_id: userId,
          client_accept_appointment: true,
        },
        select: {
          id: true,
          customers: {
            select: {
              first_name: true,
              last_name: true,
              seller_id: true,
            },
          },
        },
      });

      const activeLead = await prisma.leads.findFirst({
        where: {
          is_active: true,
          customer_id: customerId,
        },
        select: {
          id: true,
        },
      });

      if (activeLead && activeLead.id) {
        const lead = await prisma.leads.update({
          where: {
            id: activeLead.id,
            is_active: true,
            customer_id: customerId,
          },
          data: {
            appointment_id: {
              push: data.id,
            },
          },
        });
      }

      const message = `The customer ${data.customers.first_name} ${data.customers.last_name} has arrived`;

      await createNotification({
        message: message,
        notificationType: {
          general: true,
        },
        assignedToId: data.customers.seller_id,
        customerId: customerId,
        notificationsForManagers: true,
        eventTypeId: 3,
      });

      const description = 'Customer arrived to the store';

      userId && (await createEvent(description, userId, customerId));
    }

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Visit Successfully Updated' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
