import { mockDb } from '@/app/libs/mock-db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server'
import { z } from 'zod';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const userIdParam = searchParams.get('userId');

  let where: any = {};

  if (status) {
    where.status = parseInt(status, 10);
  }

  if (userIdParam) {
    const userId = parseInt(userIdParam, 10);
    where = {
      ...where,
      OR: [
        {
          assigned_to: userId,
        },
        {
          assigned_seller_id: userId,
        },
      ],
    };
  }

  try {
    const data = await mockDb.tasks.findMany({
      where,
      orderBy: [
        {
          manager_task: 'desc',
        },
        { deadline: 'asc' },
      ],
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
