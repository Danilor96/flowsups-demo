import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id);

  try {
    const data = mockDb.notifications.updateMany({
      where: {
        user_id: userId,
      },
      data: {
        is_read: true,
      },
    });

    return NextResponse.json({ successMessage: 'Notifications Successfully Updated' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
