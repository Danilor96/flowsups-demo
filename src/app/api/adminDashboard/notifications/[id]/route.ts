import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id);

  const formData = await request.formData();

  const roleSchema = z.object({
    userRoleId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
    typeId: z.string().optional(),
  });

  const validatedData = roleSchema.safeParse({
    userRoleId: formData.get('userRoleId'),
    page: formData.get('page') || '1',
    limit: formData.get('limit') || '10',
    typeId: formData.get('typeId'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { userRoleId, page, limit, typeId } = validatedData.data;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  let noti;

  try {
    const notificationsPreferences = mockDb.notifications_preferences.findMany();

    let whereVal: any = {
      user_id: userId,
      is_deleted: false,
    };

    if (userRoleId === '3' || userRoleId === '4' || userRoleId === '1' || userRoleId === '2') {
      whereVal = {
        OR: [
          {
            user_id: userId,
            is_deleted: false,
          },
          {
            notification_for_managers: true,
            is_deleted: false,
          },
        ],
      };
    }

    if (typeId) {
      const typeIdNum = parseInt(typeId);
      if (whereVal.OR) {
        whereVal.OR = whereVal.OR.map((condition: any) => ({
          ...condition,
          type_id: typeIdNum,
        }));
      } else {
        whereVal.type_id = typeIdNum;
      }
    }

    const finalWhere = {
      ...whereVal,
    };

    const data = mockDb.notifications.findMany({
      where: finalWhere,
      orderBy: {
        created_at: 'desc',
      },
      skip: skip,
      take: limitNum + 1,
    });

    const hasMore = data.length > limitNum;

    if (hasMore) {
      data.pop();
    }

    noti = {
      notifications: data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: 0,
        hasMore,
      },
    };

    return NextResponse.json(noti);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const notiId = parseInt(params.id);

  const formData = await request.formData();

  const notiSchema = z.object({
    option: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = notiSchema.safeParse({
    option: formData.get('option'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { option } = validatedData.data;

  try {
    const data = mockDb.notifications.update({
      where: {
        id: notiId,
      },
      data: {
        is_read: option === 'read' ? true : false,
      },
    });

    return NextResponse.json({ successMessage: 'Notification Successfully Changed' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const notiId = parseInt(params.id);

  try {
    const data = mockDb.notifications.delete({
      where: {
        id: notiId,
      },
    });

    return NextResponse.json({ successMessage: 'Notification Successfully Deleted' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
