import { mockDb } from '@/app/libs/mock-db';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  try {
    const data = mockDb.client_calls.findMany({
      where: {
        client_id: customerId,
      },
      orderBy: {
        call_date: 'desc',
      },
    }) as any[];

    const usersArray = mockDb.users.findMany({
      where: {
        deleted_at: null,
      },
    });

    for (let i = 0; i < data.length; i++) {
      const call = data[i];

      call.user = Array.isArray(call.user) ? call.user : [];

      for (let i = 0; i < call.user_id.length; i++) {
        const userThatAnsweredTheCall = call.user_id[i];

        const userFromUsersArray = usersArray.find((el) => el.id === userThatAnsweredTheCall);

        if (userFromUsersArray) {
          if (!call.user.some((el: any) => el.id === userFromUsersArray.id)) {
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

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}