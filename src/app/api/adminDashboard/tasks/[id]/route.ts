import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { z } from 'zod';
import { checkPermissions } from '@/app/libs/auth-helpers';
import { ensureActiveUserOrGetReplacement } from '@/app/libs/round-robin';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const taskId = params.id;

  try {
    const data = await mockDb.tasks.findUnique({
      where: {
        id: parseInt(taskId),
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions([14, 15, 16, 17, 18, 19]);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const session = await auth();
  const userSession = session?.user;
  if (!userSession || !userSession.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const taskId = parseInt(params.id);
  const formData = await request.formData();

  const taskSchema = z.object({
    assignedCustomerId: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    interestedVehicleId: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    followUpDate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    subject: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    description: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    reminderTimeId: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    taskAssignedTo: z
      .array(z.string({ invalid_type_error: 'Please enter a valid value' }))
      .min(1, 'Please enter a value'),
  });

  const assignedArray = formData.get('taskAssignedTo');

  const validatedData = taskSchema.safeParse({
    assignedCustomerId: formData.get('assignedCustomerId'),
    interestedVehicleId: formData.get('interestedVehicleId'),
    followUpDate: formData.get('followUpDate'),
    subject: formData.get('subject'),
    description: formData.get('description'),
    reminderTimeId: formData.get('reminderTimeId'),
    taskAssignedTo: typeof assignedArray === 'string' ? JSON.parse(assignedArray) : [],
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    assignedCustomerId,
    interestedVehicleId,
    followUpDate,
    subject,
    description,
    reminderTimeId,
    taskAssignedTo,
  } = validatedData.data;

  try {
    const newUsersIdsInt = taskAssignedTo.map((id) => parseInt(id));

    const relatedTasks = await mockDb.tasks.findMany({
      where: {
        OR: [{ id: taskId }, { related_task_id: taskId }],
      },
    });

    const currentUsersIds = relatedTasks.map((task) => task.assigned_to);

    const [firstUser, ...otherUsers] = newUsersIdsInt;

    const currentTask = await mockDb.tasks.findUnique({
      where: {
        id: taskId,
      },
    });

    const finalAssigneeId = await ensureActiveUserOrGetReplacement(
      firstUser,
      assignedCustomerId ? parseInt(assignedCustomerId) : currentTask?.customer_id || undefined
    );

    const data = await mockDb.tasks.update({
      where: {
        id: taskId,
      },
      data: {
        reminder_time_id: reminderTimeId ? Number(reminderTimeId) : undefined,
        customer_id: assignedCustomerId ? parseInt(assignedCustomerId) : null,
        deadline: new Date(followUpDate),
        title: subject ? subject : '',
        description: description ? description : '',
        interested_vehicle_id: interestedVehicleId ? parseInt(interestedVehicleId) : null,
        assigned_to: finalAssigneeId,
        status: new Date(followUpDate) > new Date()
          ? 1
          : (currentTask?.status ?? undefined),
      },
    });

    if (otherUsers.length > 0) {
      const baseTaskData = {
        deadline: data.deadline,
        status: data.status,
        description: data.description,
        title: data.title,
        related_task_id: taskId,
        created_by: data.created_by,
        customer_id: data.customer_id,
      };

      let tasksToCreate: {
        assigned_to: number;
        deadline: Date;
        status: number;
        description: string;
        title: string;
        related_task_id: number;
        created_by?: number | null;
        customer_id: number | null;
      }[];

      tasksToCreate = [];
      const usersToProcess = currentUsersIds && currentUsersIds.length > 0
        ? otherUsers.filter((el) => !currentUsersIds.includes(el))
        : otherUsers;

      for (const userId of usersToProcess) {
        const assignedId = await ensureActiveUserOrGetReplacement(userId, data.customer_id || undefined);
        tasksToCreate.push({
          ...baseTaskData,
          assigned_to: assignedId,
        });
      }

      await mockDb.tasks.createMany({
        data: tasksToCreate,
      });
    }

    if (data && data.customer_id) {
      const activeLead = await mockDb.leads.findFirst({
        where: {
          is_active: true,
          customer_id: data.customer_id,
        },
      });

      if (activeLead && activeLead.id) {
        const lead = mockDb.leads.findFirst({
          where: {
            id: activeLead.id,
            is_active: true,
            customer_id: data.customer_id,
          },
        });

        if (lead) {
          mockDb.leads.update({
            where: {
              id: lead.id,
            },
            data: {
              task_id: [...(lead.task_id || []), data.id],
            },
          });
        }
      }
    }

    return NextResponse.json({ successMessage: 'Task Successfully Updated' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
