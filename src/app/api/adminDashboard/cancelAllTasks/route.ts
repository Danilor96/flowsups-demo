import { checkPermissions } from '@/app/libs/auth-helpers';
import { mockDb } from '@/app/libs/mock-db';
import { TaskStatuses } from '@/app/ui/dashboard/reports/storeReport/taskActivity/taskStatus/TaskStatus';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  const permissionsCheck = await checkPermissions(11);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  try {
    const { taskIds } = await req.json();

    if (!taskIds || !Array.isArray(taskIds)) {
      return NextResponse.json({ error: 'Missing or invalid taskIds' }, { status: 400 });
    }

    await mockDb.tasks.updateMany({
      where: {
        id: {
          in: taskIds,
        },
        status: {
          in: [TaskStatuses.Pending, TaskStatuses.Late],
        },
      },
      data: {
        status: 3,
      },
    });

    return NextResponse.json({ successMessage: 'Selected Tasks Canceled' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
