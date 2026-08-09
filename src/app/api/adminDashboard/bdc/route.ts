import prisma from '@/app/libs/prisma';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await prisma.users.findMany({
      where: {
        user_has: {
          every: {
            role_id: { in: [5, 2, 1] },
          },
        },
        deleted_at: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        last_name: true,
        username: true,
        created_at: true,
        updated_at: true,
        mobile_phone: true,
        img: true,
        status_id: true,
        round_robin: true,
        ready_for_leads: true,
        round_robin_order: true,
        users_status: {
          select: {
            status: true,
          },
        },
        user_has: {
          select: {
            role: {
              select: {
                role: true,
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    //await prisma.$disconnect();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
