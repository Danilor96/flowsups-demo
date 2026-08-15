import { checkPermissions } from '@/app/libs/auth-helpers';
import { createNotification } from '@/app/libs/notifications/notifications';
import { mockDb } from '@/app/libs/mock-db';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(41);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const userId = parseInt(params.id);

  const statusSchema = z.object({
    status: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = statusSchema.safeParse({
    status: formData.get('status'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldsError: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { status } = validatedData.data;

  try {
    const data = mockDb.users.update({
      where: {
        id: userId,
        deleted_at: null,
      },
      data: {
        status_id: parseInt(status),
      },
    });

    if (data.status_id === 2) {
      // if deactive
      const message = `The user ${data.name || ''} ${data.last_name || ''} has been deactivated`;
      //
      await createNotification({
        message: message,
        notificationType: {
          general: true,
        },
        notificationsForManagers: true,
        exclusiveManagerNotification: true,
        eventTypeId: 13,
      });
    }

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json({ successMessage: 'Status Successfully Changed' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(42);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const userId = parseInt(params.id);

  try {
    const data = mockDb.users.delete({
      where: {
        id: userId,
      },
    });

    return NextResponse.json({ successMessage: 'Status Successfully Deleted' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
