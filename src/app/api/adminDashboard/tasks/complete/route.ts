import { checkPermissions } from '@/app/libs/auth-helpers';
import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // const permissionsCheck = await checkPermissions(12);
  const dataBodyJson = await request.json() as { taskIds: number[] };

  // if (permissionsCheck) {
  //   return permissionsCheck;
  // }

  console.log({ dataBodyJson });
   
  try { 
    const data = await mockDb.tasks.updateMany({
      where: {
        id: {
          in: dataBodyJson.taskIds,
        },
      },
      data: {
        status: 2,
        finished_at: new Date(),
      },
    });

    return NextResponse.json({ successMessage: 'Task Successfully Completed' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
