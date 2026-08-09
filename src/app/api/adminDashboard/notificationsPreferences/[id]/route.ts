import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id);

  const formData = await request.formData();

  const notisSchema = z.object({});

  const validatedData = notisSchema.safeParse({});

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  try {
    // await prisma.notifications_preferences.updateMany({
    //   where: {
    //     user_id: userId,
    //     notification: key,
    //   },
    //   data: {
    //     active: value !== '' ? true : false,
    //   },
    // });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Notifications Preference Changed' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
