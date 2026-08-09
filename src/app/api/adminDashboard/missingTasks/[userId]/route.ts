import prisma from '@/app/libs/prisma';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const userId = params.userId;

  try {
    const userRole = await prisma.users.findUnique({
      where: {
        id: parseInt(userId),
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

    let data = undefined;

    const seeAllTasks = [1, 2];

    if (userRole?.user_has[0].role_id) {
      if (seeAllTasks.includes(userRole.user_has[0].role_id)) {
        data = await prisma.tasks.findMany({
          where: {
            status: 4,
          },
          include: {
            customer: {
              select: {
                first_name: true,
                last_name: true,
                id: true,
                mobile_phone: true,
              },
            },
            assigned: {
              select: {
                name: true,
                last_name: true,
              },
            },
          },
          orderBy: [{ manager_task: 'desc' }],
        });
      } else {
        data = await prisma.tasks.findMany({
          where: {
            status: 4,
            AND: {
              assigned_to: parseInt(userId),
            },
          },
          include: {
            customer: {
              select: {
                first_name: true,
                last_name: true,
                id: true,
                mobile_phone: true,
              },
            },
            assigned: {
              select: {
                name: true,
                last_name: true,
              },
            },
          },
          orderBy: [{ manager_task: 'desc' }],
        });
      }
    }

    //await prisma.$disconnect();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
