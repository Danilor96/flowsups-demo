import prisma from '@/app/libs/prisma';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { conferenceSid: string } }) {
  const conferenceSid = params.conferenceSid;

  const formData = await request.formData();

  const answeredBySchema = z.object({
    userEmail: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    userMobilePhoneNumber: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
  });

  const validatedData = answeredBySchema.safeParse({
    userEmail: formData.get('userEmail'),
    userMobilePhoneNumber: formData.get('userMobilePhoneNumber'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { userEmail, userMobilePhoneNumber } = validatedData.data;

  try {
    let userId: number | null = null;

    if (userEmail) {
      const answeredUserEmail = await prisma.users.findUnique({
        where: {
          email: userEmail,
          deleted_at: null,
        },
        select: {
          id: true,
        },
      });

      if (answeredUserEmail) userId = answeredUserEmail?.id;
    }

    if (userMobilePhoneNumber) {
      const answeredUserEmail = await prisma.users.findUnique({
        where: {
          mobile_phone: userMobilePhoneNumber,
          deleted_at: null,
        },
        select: {
          id: true,
        },
      });

      if (answeredUserEmail) userId = answeredUserEmail?.id;
    }

    if (userId) {
      const dataToRemove = await prisma.client_calls.findUnique({
        where: {
          call_sid: conferenceSid,
        },
        select: {
          user_id: true,
        },
      });

      const filteredData = dataToRemove?.user_id.filter((id) => id !== userId);

      const data = await prisma.client_calls.update({
        where: {
          call_sid: conferenceSid,
        },
        data: {
          user_id: filteredData,
        },
      });

      return NextResponse.json({ successMessage: 'Call Successfully Updated' });
    }

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'User Not Found' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
