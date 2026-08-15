import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendSms } from '@/app/libs/smsTemplateFunctionsAndTwilioSms';
import { getCustomerSmsTemplateVariablesValues } from '@/app/libs/data';
import { dataObject, replaceVariables } from '@/app/libs/smsTemplateFunctionsAndTwilioSms';
import { createNotification } from '@/app/libs/notifications/notifications';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const appointmentId = parseInt(params.id);

  try {
    const data = await mockDb.appointments.findUnique({
      where: {
        id: appointmentId,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions([76]);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const appointmentId = parseInt(params.id);

  const formData = await request.formData();

  const appointmentSchema = z.object({
    startDate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    endDate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = appointmentSchema.safeParse({
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { endDate, startDate } = validatedData.data;

  try {
    const appointment = await mockDb.appointments.findUnique({
      where: {
        id: appointmentId,
      },
    });
    const existingAppointment = await mockDb.appointments.findFirst({
      where: {
        id: {
          not: appointmentId,
        },
        customer_id: appointment?.customer_id,
        NOT: {
          status_id: {
            in: [3], // 3 = Canceled, 4 = Rescheduled
          },
        },
        start_date: {
          lt: endDate,
        },
        end_date: {
          gt: startDate,
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

    const customerPhoneNumber = await mockDb.appointments.findUnique({
      where: { id: appointmentId },
    });

    const phoneNumberExists =
      customerPhoneNumber?.customers &&
      (customerPhoneNumber.customers.mobile_phone || customerPhoneNumber.customers.home_phone);

    if (!phoneNumberExists) throw new Error('No customer phone number found');

    const data = await mockDb.appointments.update({
      where: {
        id: appointmentId,
      },
      data: {
        start_date: new Date(startDate),
        end_date: new Date(endDate),
      },
    });

    const appointmentTemplate = await mockDb.automatic_sms.findFirst();

    const customer = await mockDb.clients.findUnique({
      where: {
        id: data.customer_id,
      },
    });

    if (
      customer &&
      customer.consent_approved &&
      appointmentTemplate &&
      (appointmentTemplate.appointment_reschedule_online ||
        appointmentTemplate.appointment_reschedule_onSite)
    ) {
      if (
        appointmentTemplate.appointment_reschedule_onSite_template_id ||
        appointmentTemplate?.appointment_reschedule_online_template_id
      ) {
        const appointmentMessage =
          appointmentTemplate.reschedule_onSite_template?.template ||
          appointmentTemplate.reschedule_online_template?.template;

        const customerVariablesValues = await getCustomerSmsTemplateVariablesValues(
          customer.id.toString(),
        );

        const dataObj = dataObject(customerVariablesValues, startDate, endDate);

        const sms = replaceVariables(appointmentMessage || '', dataObj);

        const { home_phone, mobile_phone } = customerPhoneNumber.customers;

        await sendSms(
          sms,
          mobile_phone || home_phone || '',
          data?.user_id?.toString() || '',
          undefined,
          undefined,
          false,
        );
      }
    }

    const message = `Appointment with customer ${customer?.first_name || ''} ${
      customer?.last_name || ''
    } has been rescheduled for: date.start{${new Date(startDate)}} to date.end{${new Date(
      endDate,
    )}}`;

    await createNotification({
      message: message,
      notificationType: {
        appointment: true,
      },
      assignedToId: data.user_id,
      eventType: {
        'appointment reschedule': true,
      },
      notificationsForManagers: true,
      appointmentId: data.id,
    });

    return NextResponse.json({ successMessage: 'Appointement SuccessFully Rescheduled' });
  } catch (error: any) {
    console.log(error);

    const phoneErrorMssg =
      typeof error?.message === 'string' ? error?.message.includes('phone number') : false;

    const errorMssg = phoneErrorMssg ? error?.message : 'Server Error';

    return NextResponse.json({ serverError: errorMssg }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions([77]);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const appointmentId = parseInt(params.id);

  try {
    const data = await mockDb.appointments.delete({
      where: {
        id: appointmentId,
      },
    });

    return NextResponse.json({ successMessage: 'Appointment Successfully Deleted' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
