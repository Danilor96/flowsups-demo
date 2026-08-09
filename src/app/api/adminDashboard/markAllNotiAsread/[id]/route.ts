import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id);

  try {
    const data = await prisma.notifications.updateMany({
      where: {
        user_id: userId,
      },
      data: {
        is_read: true,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Notifications Successfully Updated' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
