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

    // Get event_type_ids where user is NOT allowed (has preference but user not in user_ids)
    // const excludedEventTypeIds = notificationsPreferences
    //   .filter((pref) => pref.event_type_id !== null && !pref.user_ids.includes(userId))
    //   .map((pref) => pref.event_type_id as number);

    let whereVal: any = {
      user_id: userId,
      is_deleted: false,
      is_read: false,
    };

    if (userRoleId === '3' || userRoleId === '4' || userRoleId === '1') {
      whereVal = {
        OR: [
          {
            user_id: userId,
            is_deleted: false,
            is_read: false,
          },
          {
            notification_for_managers: true,
            is_deleted: false,
            is_read: false,
          },
        ],
      };
    }

    // Add filter to exclude notifications with excluded event_type_ids
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

    const groupedCounts = await prisma.notifications.groupBy({
      by: ['type_id'],
      where: finalWhere,
      _count: {
        type_id: true,
      },
    });

    const counts = {
      general: 0,
      appointment: 0,
      inventory: 0,
      customers: 0,
      warnings: 0,
    };

    for (const group of groupedCounts) {
      switch (group.type_id) {
        case 1:
          counts.general = group._count.type_id;
          break;
        case 2:
          counts.appointment = group._count.type_id;
          break;
        case 3:
          counts.inventory = group._count.type_id;
          break;
        case 4:
          counts.customers = group._count.type_id;
          break;
        case 5:
          counts.warnings = group._count.type_id;
          break;
        default:
          break;
      }
    }

    return NextResponse.json(counts);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
