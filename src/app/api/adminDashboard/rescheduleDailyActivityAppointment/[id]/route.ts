import { checkPermissions } from '@/app/libs/auth-helpers';
import { createEvent } from '@/app/libs/events/events';
import { createNotification } from '@/app/libs/notifications/notifications';
import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(4);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const appointmentId = parseInt(params.id);

  const formData = await request.formData();

  const rescheduleSchedule = z.object({
    date: z
      .string({ invalid_type_error: 'Please, enter a valid a value' })
      .min(1, 'Please enter a value'),
    dateFromPicked: z
      .string({ invalid_type_error: 'Please, enter a valid a value' })
      .min(1, 'Please enter a value'),
    dateToPicked: z
      .string({ invalid_type_error: 'Please, enter a valid a value' })
      .min(1, 'Please enter a value'),
    from: z
      .string({ invalid_type_error: 'Please, enter a valid a value' })
      .min(1, 'Please enter a value'),
    to: z
      .string({ invalid_type_error: 'Please, enter a valid a value' })
      .min(1, 'Please enter a value'),
    userId: z
      .string({ invalid_type_error: 'Please, enter a valid a value' })
      .min(1, 'Please enter a value'),
    customerId: z
      .string({ invalid_type_error: 'Please, enter a valid a value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = rescheduleSchedule.safeParse({
    date: formData.get('date'),
    dateFromPicked: formData.get('dateFromPicked'),
    dateToPicked: formData.get('dateToPicked'),
    from: formData.get('from'),
    to: formData.get('to'),
    userId: formData.get('userId'),
    customerId: formData.get('customerId'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { date, dateFromPicked, dateToPicked, from, to, userId, customerId } = validatedData.data;

  const deadline = new Date().setHours(23, 59, 59);

  const taskTitle = 'Appointment Reschedule';

  try {
    const existingAppointment = await mockDb.appointments.findFirst({
      where: {
        customer_id: parseInt(customerId),
        id: {
          not: appointmentId,
        },
        NOT: {
          status_id: {
            in: [3], // 3 = Canceled, 4 = Rescheduled
          },
        },
        start_date: {
          lt: new Date(dateToPicked).toISOString(),
        },
        end_date: {
          gt: new Date(dateFromPicked).toISOString(),
        },
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        {
          serverError: `Error: This client already has an appointment scheduled at this time`,
          startDate: existingAppointment.start_date,
          endDate: existingAppointment.end_date,
          timeConflict: true,
        },
        { status: 409 },
      );
    }

    const data = await mockDb.appointments.update({
      where: {
        id: appointmentId,
      },
      data: {
        prevented_start_date: new Date(dateFromPicked).toISOString(),
        prevented_end_date: new Date(dateToPicked).toISOString(),
        waiting_aprove: true,
        last_check: new Date(),
      },
    });

    const task = await mockDb.tasks.create({
      data: {
        deadline: new Date(deadline),
        description: 'Reschedule requested',
        title: taskTitle,
        customer_id: parseInt(customerId),
        created_by: parseInt(userId),
        status: 1,
        assigned_to_all_managers: true,
        appointment_id: data.id,
      },
    });
    //
    await createNotification({
      message: 'There is a new appointment reschedule request.',
      notificationType: {
        appointment: true,
      },
      appointmentId: data.id,
      notificationsForManagers: true,
      exclusiveManagerNotification: true,
      eventTypeId: 6,
    });

    const description = 'Appointment reschedule requested';

    await createEvent(description, parseInt(userId), parseInt(customerId));

    return NextResponse.json({ successMessage: 'Request seccessfully sended to the managers' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
