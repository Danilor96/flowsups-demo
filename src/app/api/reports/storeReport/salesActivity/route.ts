import { buildDatePrismaFilter } from '@/app/libs/buildDatePrismaFilter';
import { mockDb, Decimal } from '@/app/libs/mock-db';
import { NextRequest, NextResponse } from 'next/server';

const TASK_STATUS = {
  PENDING: 1,
  COMPLETED: 2,
  CANCELLED: 3,
  LATE: 4,
};

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const option = searchParams.get('optionDate');
    const value = searchParams.get('valueDate');
    const from = searchParams.get('fromDate');
    const to = searchParams.get('toDate');

    const dateFilterObject = option ? { option, value, from, to } : null;
    const dateWhereClause = buildDatePrismaFilter(dateFilterObject);

    const userData = mockDb.users.findMany({
      select: {
        id: true,
        name: true,
        last_name: true,
        username: true,
        _count: {
          select: {
            // client_seller: true,
            // sms_sender is not filtered by date here, so we do a separate query
            sms_sender: {
              where: {
                date_sent: dateWhereClause,
                manual_sent: true,
              },
            },
          },
        },
      },
    });

    const smsAuto = mockDb.users.findMany({
      select: {
        id: true,
        _count: {
          select: {
            sms_sender: {
              where: {
                date_sent: dateWhereClause,
                manual_sent: false,
              },
            },
          },
        },
      },
    })
    const smsAutoMap = new Map(smsAuto.map(el => [el.id, el._count.sms_sender ?? 0]));

    const leadsByUsers = mockDb.users_has_customers.groupBy({
      by: ['user_id'],
      where: {
        created_at: dateWhereClause,
      },
      _count: {
        _all: true,
      }
    });
    const leadsByUsersMap = new Map(leadsByUsers.map(el => [el.user_id, el._count._all]));

    const pendingTasksBySeller = mockDb.tasks.groupBy({
      by: ['assigned_seller_id'],
      where: {
        status: TASK_STATUS.PENDING,
        OR: [{ assigned_seller_id: { not: null } }],
        created_at: dateWhereClause,
      },
      _count: {
        _all: true, // Contamos todas las tareas en el grupo
      },
    });
    const pendingTasksByAssignedTo = mockDb.tasks.groupBy({
      by: ['assigned_to'],
      where: {
        status: TASK_STATUS.PENDING,
        OR: [{ assigned_to: { not: null } }],
        created_at: dateWhereClause,
      },
      _count: {
        _all: true,
      },
    });
    const pendingTasksMap = new Map(pendingTasksBySeller.map(el => [el.assigned_seller_id, el._count._all]));
    pendingTasksByAssignedTo.forEach(el => {
      if (!pendingTasksMap.has(el.assigned_to)) {
        pendingTasksMap.set(el.assigned_to, el._count._all);
      }
    })

    const lateTasksBySeller = mockDb.tasks.groupBy({
      by: ['assigned_seller_id'],
      where: {
        status: TASK_STATUS.LATE,
        OR: [{ assigned_seller_id: { not: null } }],
        created_at: dateWhereClause,
      },
      _count: {
        _all: true,
      },
    });
    const lateTasksByAssignedTo = mockDb.tasks.groupBy({
      by: ['assigned_to'],
      where: {
        status: TASK_STATUS.LATE,
        OR: [{ assigned_to: { not: null } }],
        created_at: dateWhereClause,
      },
      _count: {
        _all: true,
      },
    });

    const lateTasksMap = new Map(
      lateTasksBySeller.map(el => [el.assigned_seller_id, el._count._all]),
    );

    lateTasksByAssignedTo.forEach(el => {
      if (!lateTasksMap.has(el.assigned_to)) {
        lateTasksMap.set(el.assigned_to, el._count._all);
      }
    })

    const completedTasksBySeller = mockDb.tasks.groupBy({
      by: ['assigned_seller_id'],
      where: {
        status: TASK_STATUS.COMPLETED,
        OR: [{ assigned_seller_id: { not: null } }],
        created_at: dateWhereClause,
      },
      _count: {
        _all: true,
      },
    });

    const completedTasksByAssignedTo = mockDb.tasks.groupBy({
      by: ['assigned_to'],
      where: {
        status: TASK_STATUS.COMPLETED,
        OR: [{ assigned_to: { not: null } }],
        created_at: dateWhereClause,
      },
      _count: {
        _all: true,
      },
    });

    const completedTasksMap = new Map(
      completedTasksBySeller.map(el => [el.assigned_seller_id, el._count._all]),
    );

    completedTasksByAssignedTo.forEach(el => {
      if (!completedTasksMap.has(el.assigned_to)) {
        completedTasksMap.set(el.assigned_to, el._count._all);
      }
    })

    const inboundCalls = mockDb.client_calls.groupBy({
      by: ['user_id'],
      where: {
        call_direction_id: 1,
        user_id: { isEmpty: false },
        call_date: dateWhereClause,
      },
      _count: {
        _all: true,
      },
    });
    const inboundCallsMap = new Map(
      inboundCalls.map(el => [el.user_id && el.user_id.length > 0 ? el.user_id[0] : 0, el._count._all]),
    );

    const outboundCalls = mockDb.client_calls.groupBy({
      by: ['user_id'],
      where: {
        call_direction_id: 2,
        user_id: { isEmpty: false },
        call_date: dateWhereClause,
      },
      _count: {
        _all: true,
      },
    });
    const outboundCallsMap = new Map(
      outboundCalls.map(el => [el.user_id && el.user_id.length > 0 ? el.user_id[0] : 0, el._count._all]),
    );

    const madeAppointments = mockDb.appointments.groupBy({
      by: ['created_by'],
      where: {
        created_at: dateWhereClause,
      },
      _count: {
        _all: true,
      },
    });

    const madeAppointmentsMap = new Map(madeAppointments.map(el => [el.created_by, el._count._all]));

    const cancelledAppointmentsByUserAssigned = mockDb.appointments.groupBy({
      by: ['user_id'],
      where: {
        status_id: 3,
        created_at: dateWhereClause,
      },
      _count: {
        _all: true,
      },
    });

    const cancelledAppointmentsMap = new Map(
      cancelledAppointmentsByUserAssigned.map(el => [el.user_id, el._count._all]),
    );

    const rescheduledAppointmentsByUserAssigned = mockDb.appointments.groupBy({
      by: ['user_id'],
      where: {
        status_id: 4,
        created_at: dateWhereClause,
      },
      _count: {
        _all: true,
      },
    })
    const rescheduledAppointmentsMap = new Map(
      rescheduledAppointmentsByUserAssigned.map(el => [el.user_id, el._count._all]),
    );

    const completedAppointmentsByUserAssigned = mockDb.appointments.groupBy({
      by: ['user_id'],
      where: {
        status_id: 2,
        created_at: dateWhereClause,
      },
      _count: {
        _all: true,
      },
    });

    const completedAppointmentsMap = new Map(
      completedAppointmentsByUserAssigned.map(el => [el.user_id, el._count._all]),
    );

    const confirmedAppointmentsByUserAssigned = mockDb.appointments.groupBy({
      by: ['user_id'],
      where: {
        status_id: 6,
        created_at: dateWhereClause,
      },
      _count: {
        _all: true,
      },
    });

    const confirmedAppointmentsMap = new Map(
      confirmedAppointmentsByUserAssigned.map(el => [el.user_id, el._count._all]),
    );

    const activityEmailCount = mockDb.sales_activity_log.groupBy({
      by: ['user_id'], // Agrupamos por vendedor y tipo de actividad
      _count: {
        _all: true,
      },
      where: {
        activity_type: 'EMAIL_SENT',
        created_at: dateWhereClause,
      },
    });
    const activityEmailCountMap = new Map(
      activityEmailCount.map(el => [el.user_id, el._count._all]),
    );

    const activitySoldCount = mockDb.sales_activity_log.groupBy({
      by: ['user_id'], // Agrupamos por vendedor y tipo de actividad
      _count: {
        _all: true,
      },
      where: {
        activity_type: 'CUSTOMER_SOLD',
        created_at: dateWhereClause,
      },
    });
    const activitySoldCountMap = new Map(
      activitySoldCount.map(el => [el.user_id, el._count._all]),
    );

    const deals = mockDb.deal.findMany({
      where: {
        created_at: dateWhereClause,
      },
    });
    // const dealsMap = new Map(deals.map(el => [el.seller_id, el]));

    // 3. Unimos los resultados
    const result = userData.map(user => {
      let frontend = Decimal(0);
      let backend = Decimal(0);
      deals.forEach(deal => {
        if (deal.seller_id === user.id) {
          if (deal.frontend) {
            frontend = frontend.add(deal.frontend)
          }
          if (deal.backend) {
            backend = backend.add(deal.backend)
          }
        }
      })

      return {
        ...user,
        full_name: user.name + ' ' + user.last_name,
        _count: {
          ...user._count,
          client_seller: leadsByUsersMap.get(user.id) || 0,
          pending_tasks: pendingTasksMap.get(user.id) || 0,
          late_tasks: lateTasksMap.get(user.id) || 0,
          completed_tasks: completedTasksMap.get(user.id) || 0,
          inbound_calls: inboundCallsMap.get(user.id) || 0,
          outbound_calls: outboundCallsMap.get(user.id) || 0,
          made_appointments: madeAppointmentsMap.get(user.id) || 0,
          cancelled_appointments: cancelledAppointmentsMap.get(user.id) || 0,
          rescheduled_appointments: rescheduledAppointmentsMap.get(user.id) || 0,
          completed_appointments: completedAppointmentsMap.get(user.id) || 0,
          confirmed_appointments: confirmedAppointmentsMap.get(user.id) || 0,
          manual_email: activityEmailCountMap.get(user.id) || 0,
          auto_email: 0,
          manual_sms: user._count.sms_sender || 0,
          auto_sms: smsAutoMap.get(user.id) || 0,
          sold_unit: activitySoldCountMap.get(user.id) || 0,
          frontend: frontend.toNumber(),
          backend: backend.toNumber(),
          total: frontend.add(backend).toNumber()
        },
      };
    });

    console.log('Data: ', result);

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
