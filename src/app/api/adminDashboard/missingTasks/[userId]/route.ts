import { mockDb } from '@/app/libs/mock-db';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const userId = params.userId;

  try {
    const userRole = await mockDb.users.findUnique({
      where: {
        id: parseInt(userId),
        deleted_at: null,
      },
    });

    let data = undefined;

    const seeAllTasks = [1, 2];

    if (userRole?.user_has[0].role_id) {
      if (seeAllTasks.includes(userRole.user_has[0].role_id)) {
        data = await mockDb.tasks.findMany({
          where: {
            status: 4,
          },
          orderBy: [{ manager_task: 'desc' }],
        });
      } else {
        data = await mockDb.tasks.findMany({
          where: {
            status: 4,
            AND: {
              assigned_to: parseInt(userId),
            },
          },
          orderBy: [{ manager_task: 'desc' }],
        });
      }
    }

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
