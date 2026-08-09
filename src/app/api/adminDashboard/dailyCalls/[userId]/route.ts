import prisma from '@/app/libs/prisma';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { Roles } from '../types';
import { getEndOfDay, getStartOfDay } from '@/app/libs/buildDatePrismaFilter';

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const userId = Number(params.userId);

  const session = await auth();

  const roleId = session?.user.user_has[0].role_id;

  const hasPermissionToGetAll = roleId === Roles.Administrator || roleId === Roles.Superuser;

  const { searchParams } = request.nextUrl;
  const timeZone = searchParams.get('timezone') || 'America/Chicago';
  const now = new Date();
  const startOfTodayUTC = getStartOfDay(now, timeZone);
  const endOfTodayUTC = getEndOfDay(now, timeZone);

  try {
    const data = await prisma.client_calls.findMany({
      where: {
        call_date: {
          gte: startOfTodayUTC,
          lte: endOfTodayUTC,
        },
        user_id: hasPermissionToGetAll
          ? undefined
          : {
              has: userId,
            },
        call_duration: {
          not: {
            equals: '0',
          },
        },
      },
      select: {
        id: true,
        client_call: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            // seller: {
            //   select: {
            //     id: true,
            //     name: true,
            //     last_name: true,
            //   },
            // },
          },
        },
        call_date: true,
        call_direction_id: true,
        call_duration: true,
        phone_number: true,
        user_id: true,
        user: {
          select: {
            id: true,
            name: true,
            last_name: true,
          },
        },
      },
      orderBy: {
        call_date: 'desc',
      },
    });

    const usersArray = await prisma.users.findMany({
      where: {
        deleted_at: null,
      },
      select: {
        id: true,
        name: true,
        last_name: true,
      },
    });

    const usersMap = new Map<number, { id: number; name: string | null; last_name: string | null }>();
    usersArray.forEach((user) => {
      usersMap.set(user.id, user);
    });

    const dataWithUsers = data.map((call: any) => {
      const users = (call.user_id as number[])
        .map((id) => usersMap.get(id))
        .filter((u): u is { id: number; name: string | null; last_name: string | null } => !!u);

      return {
        ...call,
        user: users,
      };
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(dataWithUsers);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
