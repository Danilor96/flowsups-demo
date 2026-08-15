import { checkPermissions } from '@/app/libs/auth-helpers';
import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(55);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const userId = parseInt(params.id);

  const formData = await request.formData();

  const userSchema = z.object({
    roundRobin: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter at least 1 value'),
    readyForLeads: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
  });

  const validatedData = userSchema.safeParse({
    roundRobin: formData.get('roundRobin'),
    readyForLeads: formData.get('readyForLeads'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldError: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { roundRobin, readyForLeads } = validatedData.data;

  try {
    const newOrder = roundRobin === '1' ? setCurrentRoundRobinOrder(userId) : null;

    const data = mockDb.users.update({
      where: {
        id: userId,
        deleted_at: null,
      },
      data: {
        round_robin: roundRobin === '1' ? true : false,
        ready_for_leads: readyForLeads === '1' ? true : false,
        round_robin_order: newOrder,
      },
    });

    // if a user was kicked from round robin, re-sort the list

    if (roundRobin !== '1') sortCurrentActiveRoundRobinUsers();

    return NextResponse.json({ successMessage: 'Round Robin Successfully Updated' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error ' }, { status: 500 });
  }
}

const setCurrentRoundRobinOrder = (userId: number) => {
  const usersInRoundRobin = mockDb.users.findMany({
    where: {
      round_robin: true,
      round_robin_order: {
        not: null,
      },
      deleted_at: null,
    },
    orderBy: {
      round_robin_order: 'asc',
    },
  });

  const userAlreadyExists = usersInRoundRobin.find((user) => user.id === userId);

  if (!userAlreadyExists) {
    let newOrderNumber = 1;

    for (let i = 0; i < usersInRoundRobin.length; i++) {
      const currentOrder = usersInRoundRobin[i].round_robin_order;

      if (currentOrder) {
        if (newOrderNumber <= currentOrder) newOrderNumber = currentOrder + 1;
      }
    }

    return newOrderNumber;
  }

  return userAlreadyExists.round_robin_order;
};

const sortCurrentActiveRoundRobinUsers = () => {
  try {
    const data = mockDb.users.findMany({
      where: {
        round_robin: true,
        round_robin_order: {
          not: null,
        },
        deleted_at: null,
      },
      orderBy: {
        round_robin_order: 'asc',
      },
    });

    for (let i = 0; i < data.length; i++) {
      const { id, round_robin_order } = data[i];

      mockDb.users.update({
        where: {
          id,
          deleted_at: null,
        },
        data: {
          round_robin_order: i + 1,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};
