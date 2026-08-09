import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { z } from 'zod';
import { checkPermissions } from '@/app/libs/auth-helpers';
import { ensureActiveUserOrGetReplacement } from '@/app/libs/round-robin';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const taskId = params.id;

  try {
    const data = await prisma.tasks.findUnique({
      where: {
        id: parseInt(taskId),
      },
      include: {
        interested_vehicle: {
          select: {
            id: true,
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
          },
        },
        notes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                last_name: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        },
        customer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            home_phone: true,
            work_phone: true,
            mobile_phone: true,
            intereseted_vehicle_id: true,
            lead_temperature_id: true,
            interested_vehicle: {
              select: {
                id: true,
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
              },
            },
            note: {
              select: {
                note: true,
                id: true,
                client_lead_note: {
                  select: {
                    client_leads: {
                      select: {
                        id: true,
                        lead: true,
                      },
                    },
                  },
                },
                created_at: true,
                created_by: {
                  select: {
                    name: true,
                    last_name: true,
                    id: true,
                  },
                },
              },
            },
            bdc: {
              select: {
                id: true,
                name: true,
                last_name: true,
                username: true,
              },
            },
            seller: {
              select: {
                id: true,
                name: true,
                last_name: true,
                username: true,
              },
            },
            sales_manager: {
              select: {
                id: true,
                name: true,
                last_name: true,
                username: true,
              },
            },
            finance_manager: {
              select: {
                id: true,
                name: true,
                last_name: true,
                username: true,
              },
            },
          },
        },
        assigned: {
          select: {
            name: true,
            last_name: true,
            id: true,
            username: true,
          },
        },
        assigned_seller: {
          select: {
            name: true,
            last_name: true,
            id: true,
          },
        },
        assigned_bdc: {
          select: {
            name: true,
            last_name: true,
            id: true,
          },
        },
        assigned_manager: {
          select: {
            name: true,
            last_name: true,
            id: true,
          },
        },
        assigned_finance_manager: {
          select: {
            name: true,
            last_name: true,
            id: true,
          },
        },
        task_status: {
          select: {
            status: true,
          },
        },
      },
    });

    //await prisma.$disconnect();

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

  // const userAuthenticated = await prisma.users.findUnique({
  //   where: {
  //     id: userSession.id,
  //     deleted_at: null,
  //   },
  //   include: {
  //     user_has: true,
  //   },
  // });

  // const userAuthenticatedIsManager = userAuthenticated?.user_has.some(
  //   (role) => role.role_id === 1 || role.role_id === 3 || role.role_id === 4,
  // );

  // if (!userAuthenticatedIsManager) {
  //   return NextResponse.json({ serverError: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const newUsersIdsInt = taskAssignedTo.map((id) => parseInt(id));

    const relatedTasks = await prisma.tasks.findMany({
      where: {
        OR: [{ id: taskId }, { related_task_id: taskId }],
      },
      select: {
        id: true,
        assigned_to: true,
      },
    });

    const currentUsersIds = relatedTasks.map((task) => task.assigned_to);

    // const usersToRemove = currentUsersIds.filter(
    //   (userId) => userId && !newUsersIdsInt.includes(userId),
    // );

    // if (usersToRemove.length > 0) {
    //   const notNullValue = usersToRemove.filter((userId) => userId !== null);

    //   await prisma.tasks.deleteMany({
    //     where: {
    //       AND: [{ related_task_id: taskId }, { assigned_to: { in: notNullValue } }],
    //     },
    //   });
    // }

    const [firstUser, ...otherUsers] = newUsersIdsInt;

    const currentTask = await prisma.tasks.findUnique({
      where: {
        id: taskId,
      },
      select: {
        status: true,
        customer_id: true,
      },
    });

    const finalAssigneeId = await ensureActiveUserOrGetReplacement(
      firstUser,
      assignedCustomerId ? parseInt(assignedCustomerId) : currentTask?.customer_id || undefined
    );

    const data = await prisma.tasks.update({
      where: {
        id: taskId,
      },
      data: {
        ...(reminderTimeId
          ? {
              reminder_time: {
                connect: {
                  id: Number(reminderTimeId),
                },
              },
            }
          : undefined),
        customer: assignedCustomerId
          ? { connect: { id: parseInt(assignedCustomerId) } }
          : { disconnect: true },
        deadline: new Date(followUpDate),
        title: subject ? subject : '',
        description: description ? description : '',
        interested_vehicle: interestedVehicleId
          ? {
              connect: {
                id: parseInt(interestedVehicleId),
              },
            }
          : { disconnect: true },
        assigned: {
          connect: {
            id: finalAssigneeId,
          },
        },
        task_status:
          new Date(followUpDate) > new Date()
            ? {
                connect: {
                  id: 1,
                },
              }
            : {
                connect: {
                  id: currentTask?.status,
                },
              },
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

      await prisma.tasks.createMany({
        data: tasksToCreate,
        skipDuplicates: true,
      });
    }

    if (data && data.customer_id) {
      const activeLead = await prisma.leads.findFirst({
        where: {
          is_active: true,
          customer_id: data.customer_id,
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
            customer_id: data.customer_id,
          },
          data: {
            task_id: {
              push: data.id,
            },
          },
        });
      }
    }

    return NextResponse.json({ successMessage: 'Task Successfully Updated' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
