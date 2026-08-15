import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions(53);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const notisSchema = z.object({
    usersByEvent: z
      .array(
        z.object({
          id: z
            .number({ invalid_type_error: 'Please enter a valid value' })
            .min(1, 'Please enter a value'),
          name: z
            .string({ invalid_type_error: 'Please enter a valid value' })
            .min(1, 'Please enter a value'),
        }),
      )
      .nullable(),
    eventIdSelected: z
      .string({ invalid_type_error: 'Please select an event' })
      .min(1, 'Please select an event'),
  });

  const usersByEventArray = formData.get('usersByEvent');

  const validatedData = notisSchema.safeParse({
    usersByEvent: typeof usersByEventArray === 'string' && JSON.parse(usersByEventArray),
    eventIdSelected: formData.get('eventIdSelected'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { eventIdSelected, usersByEvent } = validatedData.data;

  try {
    const usersIds: number[] = [];

    if (usersByEvent) {
      for (let i = 0; i < usersByEvent.length; i++) {
        const user = usersByEvent[i];

        usersIds.push(user.id);
      }
    }

    const data = mockDb.notifications_preferences.upsert({
      where: {
        event_type_id: parseInt(eventIdSelected),
      },
      update: {
        user_ids: usersIds,
      },
      create: {
        event_type_id: parseInt(eventIdSelected),
        user_ids: usersIds,
      },
    });

    return NextResponse.json({ successMessage: 'Notifications Preferences Changed' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = mockDb.notifications_preferences.findMany();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
