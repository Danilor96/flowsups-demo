import { Roles } from '@/app/libs/definitions/users/users';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await prisma?.users.findMany({
      where: {
        deleted_at: null,
        user_has: {
          some: {
            role_id: {
              in: [Roles.SalesRep, Roles.Administrator, Roles.Superuser],
            },
          },
        },
      },
      select: {
        name: true,
        last_name: true,
        email: true,
        id: true,
        username: true,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
