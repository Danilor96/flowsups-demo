import prisma from '@/app/libs/prisma';
import { TaskStatuses } from '@/app/ui/dashboard/reports/storeReport/taskActivity/taskStatus/TaskStatus';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ensureActiveUserOrGetReplacement } from '@/app/libs/round-robin';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const userId = Number(params.userId);

  const { searchParams } = new URL(request.url);

  const status = searchParams.getAll('status');

  const statusId =
    status && status.length > 0 ? status.map((id) => Number(id)) : [TaskStatuses.Pending];

  try {
    const userRole = await prisma.users.findUnique({
      where: {
        id: userId,
        deleted_at: null,
      },
      select: {
        user_has: {
          select: {
            role_id: true,
          },
        },
      },
    });

    const seeAllTasks = [1, 2];

    let where = undefined;

    const isAvailableToSeeAllTasks =
      userRole?.user_has[0].role_id && seeAllTasks.includes(userRole?.user_has[0].role_id)
        ? true
        : false;

    if (isAvailableToSeeAllTasks) {
      where = {
        status: {
          in: statusId,
        },
      };
    } else {
      where = {
        status: {
          in: statusId,
        },
        assigned_to: userId,
      };
    }

    const tasks = await prisma.tasks.findMany({
      where,
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

    //await prisma.$disconnect();

    return NextResponse.json(tasks);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const session = await auth();

  const creator = session?.user.id;

  const taskSquema = z.object({
    noteInput: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    sellerIdInput: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    finalDate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    clientName: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    clientId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = taskSquema.safeParse({
    noteInput: formData.get('noteInput'),
    sellerIdInput: formData.get('sellerIdInput'),
    finalDate: formData.get('finalDate'),
    clientName: formData.get('clientName'),
    clientId: formData.get('clientId'),
  });

  if (!validatedData.success) {
    return NextResponse.json(validatedData.error.flatten().fieldErrors, { status: 422 });
  }

  const { finalDate, noteInput, sellerIdInput, clientName, clientId } = validatedData.data;

  if (creator) {
    try {
      const assignedId = await ensureActiveUserOrGetReplacement(parseInt(sellerIdInput), parseInt(clientId));

      const data = await prisma.tasks.create({
        data: {
          deadline: new Date(finalDate),
          description: noteInput,
          title: `Follow up with ${clientName}`,
          assigned_to: assignedId,
          created_by: creator,
          customer_id: parseInt(clientId),
          status: 1,
        },
      });

      //await prisma.$disconnect();

      return NextResponse.json({ successMessage: 'Task Successfully Created' });
    } catch (error) {
      console.log(error);

      //await prisma.$disconnect();

      return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
