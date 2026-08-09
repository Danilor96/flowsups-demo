import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id);

  const formData = await request.formData();

  const roleSchema = z.object({
    userRoleId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = roleSchema.safeParse({
    userRoleId: formData.get('userRoleId'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { userRoleId } = validatedData.data;

  try {
    const notificationsPreferences = await prisma.notifications_preferences.findMany();

    const excludedEventTypeIds = notificationsPreferences
      .filter((pref) => pref.event_type_id !== null && !pref.user_ids.includes(userId))
      .map((pref) => pref.event_type_id as number);

    let whereVal: any = {
      user_id: userId,
      is_read: false,
      is_deleted: false,
    };

    if (userRoleId === '3' || userRoleId === '4' || userRoleId === '1') {
      whereVal = {
        OR: [
          {
            notification_for_managers: true,
            is_read: false,
            is_deleted: false,
          },
          {
            user_id: userId,
            is_read: false,
            is_deleted: false,
          },
        ],
      };
    }

    // const finalWhere = {
    //   ...whereVal,
    //   NOT: excludedEventTypeIds.length > 0 ? {
    //     event_type_id: {
    //       in: excludedEventTypeIds,
    //     },
    //   } : undefined,
    // };

    const finalWhere = {
      ...whereVal,
    };

    const total = await prisma.notifications.count({
      where: finalWhere,
    });

    return NextResponse.json(total);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
