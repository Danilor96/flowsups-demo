import { NextResponse } from 'next/server';
import { mockDb } from '@/app/libs/mock-db';
import { z } from 'zod';
import { sendSms } from '@/app/libs/smsTemplateFunctionsAndTwilioSms';
import { getCustomerSmsTemplateVariablesValues } from '@/app/libs/data';
import { dataObject, replaceVariables } from '@/app/libs/smsTemplateFunctionsAndTwilioSms';
import { revalidatePath } from 'next/cache';
import { createNotification } from '@/app/libs/notifications/notifications';
import { createEvent } from '@/app/libs/events/events';
import { formatDateClientWithAMPM } from '@/app/libs/formatDateTime';
import {
  ActivityType,
  sellerActivityEventEmitterAsync,
} from '@/app/libs/services/salesPointsService';
import { checkPermissions } from '@/app/libs/auth-helpers';
import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { Roles } from '../dailyCalls/types';

export async function GET(request: NextRequest) {
  const session = await auth();
  const userRoleId = session?.user.user_has[0]?.role_id;
  const userId = session?.user.id;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userIdParam = searchParams.get('userId');
    const userCreator = searchParams.get('userCreator');

    const adminRoles = [
      Roles.Superuser,
      Roles.Administrator,
      Roles.SalesManager,
      Roles.FinanceManager,
    ];

    const data = await mockDb.appointments.findMany({
      where: {
        // user_id: userIdParam ? parseInt(userIdParam) : undefined,
        status_id: status ? parseInt(status) : undefined,
        ...(userRoleId && !adminRoles.includes(userRoleId)
          ? {
              OR: [
                {
                  created_by: userCreator ? parseInt(userCreator) : undefined,
                },
                {
                  user_id: userId,
                },
              ],
            }
          : null),
      },
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        serverError: 'Server Error',
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions([75]);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const appointmentSchema = z.object({
    customer_id: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    seller_id: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    user_id: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    initial_date: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    final_date: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    initialDateInZone: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    finalDateInZone: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    creator: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    now: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    interested_vehicle: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a valid value')
      .nullish(),
    note: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
  });

  const validatedData = appointmentSchema.safeParse({
    customer_id: formData.get('customer_id'),
    seller_id: formData.get('seller_id'),
    user_id: formData.get('user_id'),
    initial_date: formData.get('initial_date'),
    final_date: formData.get('final_date'),
    initialDateInZone: formData.get('initialDateInZone'),
    finalDateInZone: formData.get('finalDateInZone'),
    creator: formData.get('creator'),
    now: formData.get('now'),
    interested_vehicle: formData.get('interested_vehicle'),
    note: formData.get('note'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    customer_id,
    final_date,
    initial_date,
    seller_id,
    creator,
    user_id,
    now,
    interested_vehicle,
    note,
    initialDateInZone,
    finalDateInZone,
  } = validatedData.data;

  try {
    const customerPhoneNumber = await mockDb.clients.findUnique({
      where: {
        id: parseInt(customer_id),
      },
    });

    const exists = customerPhoneNumber?.home_phone || customerPhoneNumber?.mobile_phone;

    if (!exists) throw new Error('No customer phone number found');

    const existingAppointment = await mockDb.appointments.findFirst({
      where: {
        customer_id: parseInt(customer_id),
        NOT: {
          status_id: {
            in: [3], // 3 = Canceled, 4 = Rescheduled
          },
        },
        start_date: {
          lt: new Date(final_date).toISOString(),
        },
        end_date: {
          gt: new Date(initial_date).toISOString(),
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

    // create appointment

    const data = await mockDb.appointments.create({
      data: {
        start_date: new Date(initial_date).toISOString(),
        end_date: new Date(final_date).toISOString(),
        customer_id: parseInt(customer_id),
        user_id: parseInt(seller_id),
        status_id: 1,
        created_at: now,
        created_by: parseInt(creator),
      },
    });

    const createdCustomer = mockDb.clients.findUnique({
      where: {
        id: parseInt(customer_id),
      },
    });

    const activeLead = await mockDb.leads.findFirst({
      where: {
        is_active: true,
        customer_id: parseInt(customer_id),
      },
    });

    if (activeLead && activeLead.id) {
      const lead = mockDb.leads.findFirst({
        where: {
          id: activeLead.id,
          is_active: true,
          customer_id: parseInt(customer_id),
        },
      });

      if (lead) {
        mockDb.leads.update({
          where: {
            id: lead.id,
          },
          data: {
            appointment_id: [...(lead.appointment_id || []), data.id],
            customer_status_id: 6,
            vehicle_id: interested_vehicle ? parseInt(interested_vehicle) : undefined,
          },
        });
      }
    }

    // update customer status to 'Appointment Scheduled'
    const customer = await mockDb.clients.update({
      where: {
        id: parseInt(customer_id),
      },
      data: {
        client_status_id: 6, // 6 is the ID for "Appointment Scheduled"
        client_status_changed_at: new Date(now).toISOString(),
        intereseted_vehicle_id: interested_vehicle ? parseInt(interested_vehicle) : undefined,
      },
    });

    // create appointment notification
    //
    const message = `There is a new appointment scheduled with customer ${createdCustomer.first_name} ${createdCustomer.last_name} at date.start{${initialDateInZone}}`;

    await createNotification({
      message: message,
      notificationType: {
        appointment: true,
      },
      assignedToId: data.user_id,
      customerId: data.customer_id,
      appointmentId: data.id,
      eventTypeId: 1,
    });

    // send appointment confirmation message to customer

    const appointmentTemplate = await mockDb.automatic_sms.findFirst();

    if (
      customer.consent_approved &&
      appointmentTemplate &&
      (appointmentTemplate.appointment_schedule_on_site ||
        appointmentTemplate.appointment_schedule_online)
    ) {
      if (
        appointmentTemplate.appointment_schedule_on_site_template_id ||
        appointmentTemplate?.appointment_schedule_online_template_id
      ) {
        const appointmentMessage =
          appointmentTemplate.schedule_online_template?.template ||
          appointmentTemplate.schedule_on_site_template?.template;

        const customerVariablesValues = await getCustomerSmsTemplateVariablesValues(customer_id);

        const dataObj = dataObject(customerVariablesValues, initialDateInZone, finalDateInZone);

        const sms = replaceVariables(appointmentMessage || '', dataObj);

        await sendSms(sms, exists, seller_id, undefined, undefined, false);
      }
    }

    // create a new lead register
    let noteId: number | null = null;

    if (note) {
      const noteData = await mockDb.notes.create({
        data: {
          note: note,
          created_at: now,
          created_by_id: parseInt(creator),
          client_id: parseInt(customer_id),
        },
      });

      noteId = noteData.id;
    }

    await mockDb.client_has_lead.create({
      data: {
        created_at: now,
        assigned_to_id: parseInt(seller_id),
        client_id: parseInt(customer_id),
        status_id: 2,
        created_by_id: parseInt(user_id),
        lead_id: 2,
        appointment_id: data.id,
        note_id: noteId,
      },
    });

    const description = `Appointment scheduled for: ${formatDateClientWithAMPM(initial_date)}`;

    await createEvent(description, parseInt(creator), parseInt(customer_id), new Date(now));

    // logic for assigning points to sellers
    if (data && data.created_by) {
      // event is sent to the socket server to run the seller activity counter in the background without adding latency to the current response.
      sellerActivityEventEmitterAsync({
        userId: data.created_by,
        activityType: ActivityType.APPOINTMENT_MADE,
      });
    }

    return NextResponse.json({ successMessage: 'Appointment Successfully Scheduled' });
  } catch (error: any) {
    console.log(error);

    const phoneErrorMssg =
      typeof error?.message === 'string' ? error?.message.includes('phone number') : false;

    const errorMssg = phoneErrorMssg ? error?.message : 'Server Error';

    return NextResponse.json({ serverError: errorMssg }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const appId = await request.json();

  try {
    const data = await mockDb.appointments.delete({
      where: {
        id: parseInt(appId),
      },
    });

    return NextResponse.json(
      { successMessage: 'Appointment Deleted Successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
