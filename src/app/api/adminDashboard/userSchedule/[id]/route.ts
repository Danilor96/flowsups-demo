import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id);

  try {
    const data = mockDb.user_schedule.findMany({
      where: {
        user_id: userId,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
