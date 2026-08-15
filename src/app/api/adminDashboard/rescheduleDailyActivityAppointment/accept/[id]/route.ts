import { createEvent } from '@/app/libs/events/events';
import { createNotification } from '@/app/libs/notifications/notifications';
import { mockDb } from '@/app/libs/mock-db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { sendSms } from '@/app/libs/smsTemplateFunctionsAndTwilioSms';
import { getCustomerSmsTemplateVariablesValues } from '@/app/libs/data';
import { dataObject, replaceVariables } from '@/app/libs/smsTemplateFunctionsAndTwilioSms';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(7);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const appointmentId = parseInt(params.id);

  const session = await auth();

  const userId = session?.user.id;

  try {
    const appointment = await mockDb.appointments.findUnique({
      where: {
        id: appointmentId,
      },
    });

    if (
      appointment &&
      appointment?.prevented_start_date &&
      appointment?.prevented_end_date &&
      appointment.customers.mobile_phone
    ) {
      const data = await mockDb.appointments.update({
        where: {
          id: appointmentId,
        },
        data: {
          start_date: appointment.prevented_start_date,
          end_date: appointment.prevented_end_date,
          prevented_start_date: null,
          prevented_end_date: null,
          waiting_aprove: false,
        },
      });

      const customer = await mockDb.clients.findUnique({
        where: {
          id: data.customer_id,
        },
      });

      const appointmentTemplate = await mockDb.automatic_sms.findFirst();

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

          const dataObj = dataObject(
            customerVariablesValues,
            appointment.prevented_start_date.toISOString(),
            appointment.prevented_end_date.toString(),
          );

          const sms = replaceVariables(appointmentMessage || '', dataObj);

          await sendSms(
            sms,
            customer.mobile_phone || '',
            data?.user_id?.toString() || '',
            undefined,
            undefined,
            false,
          );
        }
      }

      const message = `Appointment with customer ${data.customers.first_name || ''} ${
        data.customers.last_name || ''
      } has been rescheduled for: date.start{${new Date(
        appointment.prevented_start_date,
      )}} to date.end{${new Date(appointment.prevented_end_date)}}`;

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

      const descrciption = 'An appointment reschedule was successfully applied';

      userId && (await createEvent(descrciption, userId, data.customer_id));

      mockDb.tasks.updateMany({
        where: {
          appointment_id: appointmentId,
        },
        data: {
          status: 2,
        },
      });
    }

    return NextResponse.json({ successMessage: 'Appointment Successfully Rescheduled' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
