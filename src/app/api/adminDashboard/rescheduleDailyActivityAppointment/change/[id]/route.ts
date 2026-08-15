import { mockDb } from '@/app/libs/mock-db';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createEvent } from '@/app/libs/events/events';
import { auth } from '@/auth';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(7);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const appointmentId = parseInt(params.id);

  const session = await auth();

  const userId = session?.user.id;

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
  });

  const validatedData = rescheduleSchedule.safeParse({
    date: formData.get('date'),
    dateFromPicked: formData.get('dateFromPicked'),
    dateToPicked: formData.get('dateToPicked'),
    from: formData.get('from'),
    to: formData.get('to'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { date, dateFromPicked, dateToPicked, from, to } = validatedData.data;

  try {
    const data = await mockDb.appointments.update({
      where: {
        id: appointmentId,
      },
      data: {
        start_date: new Date(dateFromPicked).toISOString(),
        end_date: new Date(dateToPicked).toISOString(),
        prevented_start_date: null,
        prevented_end_date: null,
        waiting_aprove: false,
      },
    });

    mockDb.tasks.updateMany({
      where: {
        appointment_id: appointmentId,
      },
      data: {
        status: 2,
      },
    });

    const descrciption = 'An appointment reschedule was successfully applied';

    userId && (await createEvent(descrciption, userId, data.customer_id));

    return NextResponse.json({ successMessage: 'Appointment Successfully Rescheduled' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error ' }, { status: 500 });
  }
}
