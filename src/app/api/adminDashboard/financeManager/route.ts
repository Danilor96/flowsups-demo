import { mockDb } from '@/app/libs/mock-db';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = mockDb.users.findMany({
      where: {
        user_has: {
          every: {
            role_id: { in: [4, 1, 2] },
          },
        },
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
