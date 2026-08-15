import { checkPermissions } from '@/app/libs/auth-helpers';
import { createEvent } from '@/app/libs/events/events';
import { mockDb } from '@/app/libs/mock-db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(6);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const appointmentId = parseInt(params.id);

  const session = await auth();

  const userId = session?.user.id;

  try {
    const data = await mockDb.appointments.update({
      where: {
        id: appointmentId,
      },
      data: {
        waiting_aprove: false,
        change_reason: null,
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

    const descrciption = 'An appointment was successfully reinstated to its original flow';

    userId && (await createEvent(descrciption, userId, data.customer_id));

    return NextResponse.json({
      successMessage: 'Appointment Successfully Reinstated To Its Original Flow',
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
