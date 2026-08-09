import prisma from '@/app/libs/prisma';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  try {
    const data = await prisma.client_calls.findMany({
      where: {
        client_id: customerId,
      },
      select: {
        id: true,
        call_direction_id: true,
        user_id: true,
        user: {
          select: {
            id: true,
            name: true,
            last_name: true,
          },
        },
        client_call: {
          select: {
            first_name: true,
            last_name: true,
            mobile_phone: true,
          },
        },
        call_date: true,
        call_status_id: true,
        call_duration: true,
        note: {
          select: {
            note: true,
            id: true,
            created_by: {
              select: {
                name: true,
                last_name: true,
              },
            },
            created_at: true,
          },
        },
      },
      orderBy: {
        call_date: 'desc',
      },
    });

    const usersArray = await prisma.users.findMany({
      where: {
        deleted_at: null,
      },
      select: {
        id: true,
        name: true,
        last_name: true,
      },
    });

    //await prisma.$disconnect();

    for (let i = 0; i < data.length; i++) {
      const call = data[i];

      for (let i = 0; i < call.user_id.length; i++) {
        const userThatAnsweredTheCall = call.user_id[i];

        const userFromUsersArray = usersArray.find((el) => el.id === userThatAnsweredTheCall);

        if (userFromUsersArray) {
          if (!call.user.some((el) => el.id === userFromUsersArray.id)) {
            call.user.push({
              id: userFromUsersArray.id,
              name: userFromUsersArray.name || '',
              last_name: userFromUsersArray.last_name || '',
            });
          }
        }
      }
    }

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
