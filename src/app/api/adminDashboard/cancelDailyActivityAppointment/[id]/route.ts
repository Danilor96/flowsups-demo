import { checkPermissions } from '@/app/libs/auth-helpers';
import { createEvent } from '@/app/libs/events/events';
import { createNotification } from '@/app/libs/notifications/notifications';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(3);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const appointmentId = parseInt(params.id);

  const formData = await request.formData();

  const appointmentSchema = z.object({
    cancelReason: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(10, 'Please, enter at least 10 characters'),
    cancelBy: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    customerId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = appointmentSchema.safeParse({
    cancelReason: formData.get('cancelReason'),
    cancelBy: formData.get('cancelBy'),
    customerId: formData.get('customerId'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { cancelReason, cancelBy, customerId } = validatedData.data;

  const deadline = new Date().setHours(23, 59, 59);

  const taskTitle = 'Appointment Cancellation';

  try {
    const data = await prisma.appointments.update({
      where: {
        id: appointmentId,
      },
      data: {
        id: appointmentId,
        waiting_aprove: true,
        change_reason: cancelReason,
      },
    });

    const task = await prisma.tasks.create({
      data: {
        deadline: new Date(deadline),
        description: cancelReason,
        title: taskTitle,
        customer_id: parseInt(customerId),
        created_by: parseInt(cancelBy),
        status: 1,
        assigned_to_all_managers: true,
        appointment_id: data.id,
      },
    });
    //
    await createNotification({
      message: 'There is a new appointment cancellation request.',
      notificationType: {
        appointment: true,
      },
      notificationsForManagers: true,
      exclusiveManagerNotification: true,
      eventTypeId: 23,
      appointmentId: data.id,
    });

    const description = 'Appointment cancelation requested';

    await createEvent(description, parseInt(cancelBy), parseInt(customerId));

    //await prisma.$disconnect();

    return NextResponse.json({
      successMessage: 'Request seccessfully sended to the managers',
      task: task,
    });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
