import { checkPermissions } from '@/app/libs/auth-helpers';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(12);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const taskId = parseInt(params.id);

  try {
    const data = await prisma.tasks.update({
      where: {
        id: taskId,
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
