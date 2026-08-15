import { Roles } from '@/app/libs/definitions/users/users';
import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = mockDb.users.findMany({
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
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
