import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id);

  try {
    const user = mockDb.users.findUnique({
      where: {
        id: userId,
        deleted_at: null,
      },
    });

    const data = user ? { img: user.img } : null;

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
