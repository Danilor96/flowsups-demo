import { mockDb } from '@/app/libs/mock-db';
import { NextRequest, NextResponse } from 'next/server';
import { TaskActivityData } from '../types';
import { revalidatePath } from 'next/cache';
import { buildDatePrismaFilter } from '@/app/libs/buildDatePrismaFilter';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id);

  const { searchParams } = request.nextUrl;
  const option = searchParams.get('optionDate');
  const value = searchParams.get('valueDate');
  const from = searchParams.get('fromDate');
  const to = searchParams.get('toDate');

  const optionDue = searchParams.get('optionDueDate');
  const valueDue = searchParams.get('valueDueDate');
  const fromDue = searchParams.get('fromDueDate');
  const toDue = searchParams.get('toDueDate');

  const dateFilterObject = option ? { option, value, from, to } : null;

  const dueDateFilterObject = optionDue
    ? { option: optionDue, value: valueDue, from: fromDue, to: toDue }
    : null;

  try {
    const dateWhereClause = buildDatePrismaFilter(dateFilterObject);
    const dueDateWhereClause = buildDatePrismaFilter(dueDateFilterObject);

    const userRole = mockDb.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        user_has: {
          select: {
            role_id: true,
          },
        },
      },
    });

    const dataToReturn: TaskActivityData[] = [];

    if (userRole?.user_has[0].role_id) {
      const seeAllTasks = [1, 2];

      let whereClause = {};

      if (seeAllTasks.includes(userRole?.user_has[0].role_id)) {
        whereClause = {};
      } else {
        whereClause = { assigned_to: userId };
      }

      const data = mockDb.tasks.findMany({
        where: { ...whereClause, created_at: dateWhereClause, deadline: dueDateWhereClause },
        include: {
          customer: {
            select: {
              first_name: true,
              last_name: true,
              mobile_phone: true,
              lead_temperature_id: true,
              email: true,
              id: true,
              client_status_id: true,
              client_status: {
                select: {
                  status: true,
                },
              },
              client_lead_temperature: {
                select: {
                  temperature: true,
                },
              },
            },
          },
          assigned: {
            select: {
              id: true,
              name: true,
              last_name: true,
            },
          },
          task_status: {
            select: {
              status: true,
            },
          },
        },
        orderBy: [
          {
            manager_task: 'desc',
          },
          { deadline: 'asc' },
        ],
      });

      data.forEach((el) => {
        const customerFirstname = el.customer?.first_name || '';
        const customerLastname = el.customer?.last_name || '';
        const customerFullName = `${customerFirstname} ${customerLastname}`;
        const customerEmail = el.customer?.email || '';
        const customerPhoneNumber = el.customer?.mobile_phone || '';
        const customerId = el.customer_id;

        const salesRepFirstname = el.assigned?.name || '';
        const salesRepLastname = el.assigned?.last_name || '';
        const salesRepName = `${salesRepFirstname} ${salesRepLastname}`;
        const salesRepId = el.assigned?.id || 0;

        const taskDueDate = el.deadline;
        const taskStatusId = el.status;
        const taskSubject = el.title;
        const taskId = el.id;
        const taskCreatedAt = el.created_at;

        dataToReturn.push({
          customerEmail,
          customerFullName,
          customerPhoneNumber,
          salesRepName,
          taskDueDate,
          taskStatusId,
          taskSubject,
          taskId,
          customerId,
          taskCreatedAt,
          salesRepId,
        });
      });
    }

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(dataToReturn);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
