import prisma from '@/app/libs/prisma';
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
    const data = await prisma.tasks.findMany({
      where,
      include: {
        customer: {
          select: {
            first_name: true,
            last_name: true,
            mobile_phone: true,
            lead_temperature_id: true,
            email: true,
            id: true,
            client_status_id: true,
            client_status: {
              select: {
                status: true,
              },
            },
            client_lead_temperature: {
              select: {
                temperature: true,
              },
            },
          },
        },
        assigned: {
          select: {
            name: true,
            last_name: true,
          },
        },
        task_status: {
          select: {
            status: true,
          },
        },
      },
      orderBy: [
        {
          manager_task: 'desc',
        },
        { deadline: 'asc' },
      ],
    });

    //await prisma.$disconnect();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
