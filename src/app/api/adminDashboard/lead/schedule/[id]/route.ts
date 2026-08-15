import { mockDb } from '@/app/libs/mock-db';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createNotification } from '@/app/libs/notifications/notifications';
import { getCustomerSmsTemplateVariablesValues } from '@/app/libs/data';
import { dataObject, replaceVariables, sendSms } from '@/app/libs/smsTemplateFunctionsAndTwilioSms';
import { createEvent } from '@/app/libs/events/events';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  const formData = await request.formData();

  const scheduleScheme = z.object({
    assignedTo: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    createdBy: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    reminderTime: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    startDate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    startDateTime: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a day time'),
    endDate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    endDateTime: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a day time'),
    startDateInZone: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    endDateInZone: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    note: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    todaysDate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = scheduleScheme.safeParse({
    assignedTo: formData.get('assignedTo'),
    createdBy: formData.get('createdBy'),
    reminderTime: formData.get('reminderTime'),
    startDate: formData.get('startDate'),
    startDateTime: formData.get('startDateTime'),
    startDateInZone: formData.get('startDateInZone'),
    endDate: formData.get('endDate'),
    endDateTime: formData.get('endDateTime'),
    endDateInZone: formData.get('endDateInZone'),
    note: formData.get('note'),
    todaysDate: formData.get('todaysDate'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    assignedTo,
    createdBy,
    reminderTime,
    startDate,
    endDate,
    note,
    todaysDate,
    startDateInZone,
    endDateInZone,
  } = validatedData.data;

  try {
    const customerPhoneNumber = await mockDb.clients.findUnique({
      where: {
        id: customerId,
      },
    });

    const exists = customerPhoneNumber?.mobile_phone || customerPhoneNumber?.home_phone;

    if (!exists) throw new Error('No customer phone number found');

    const data = await mockDb.appointments.create({
      data: {
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
        customer_id: customerId,
        user_id: parseInt(assignedTo),
        status_id: 1,
        created_at: todaysDate,
        created_by: parseInt(createdBy),
        reminder_time_id: reminderTime && reminderTime !== '1' ? parseInt(reminderTime) : null,
      },
    });

    const activeLead = await mockDb.leads.findFirst({
      where: {
        is_selected: true,
        customer_id: customerId,
      },
    });

    if (activeLead && activeLead.id) {
      const lead = mockDb.leads.findFirst({
        where: {
          id: activeLead.id,
          is_selected: true,
          customer_id: customerId,
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
          },
        });

        await mockDb.clients.update({
          where: {
            id: customerId,
          },
          data: {
            client_status_id: 6, // 6 is the ID for "Appointment Scheduled"
            client_status_changed_at: new Date(),
          },
        });
      }
    }

    // create appointment notification

    const dateFormat = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const createdCustomer = mockDb.clients.findUnique({
      where: {
        id: customerId,
      },
    });

    const message = `There is a new appointment scheduled with customer ${
      createdCustomer?.first_name
    } ${createdCustomer?.last_name} at ${dateFormat.format(new Date(startDateInZone))}`;

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
      customerPhoneNumber?.consent_approved &&
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

        const customerVariablesValues = await getCustomerSmsTemplateVariablesValues(
          customerId.toString(),
        );

        const dataObj = dataObject(customerVariablesValues, startDateInZone, endDateInZone);

        const sms = replaceVariables(appointmentMessage || '', dataObj);

        await sendSms(sms, exists, assignedTo, undefined, undefined, false);
      }
    }

    // create a new lead register

    let noteId: number | null = null;

    if (note) {
      const noteData = await mockDb.notes.create({
        data: {
          note: note,
          created_at: todaysDate,
          created_by_id: parseInt(createdBy),
          client_id: customerId,
        },
      });

      noteId = noteData.id;
    }

    await mockDb.client_has_lead.create({
      data: {
        created_at: todaysDate,
        assigned_to_id: parseInt(assignedTo),
        client_id: customerId,
        status_id: 2,
        created_by_id: parseInt(createdBy),
        lead_id: 2,
        note_id: noteId,
      },
    });

    const description = `Appointment scheduled for: ${startDateInZone}`;

    await createEvent(description, parseInt(createdBy), customerId, new Date(todaysDate));

    return NextResponse.json({ successMessage: 'Appointment Successfully Scheduled' });
  } catch (error: any) {
    console.log(error);

    const phoneErrorMssg =
      typeof error?.message === 'string' ? error?.message.includes('phone number') : false;

    const errorMssg = phoneErrorMssg ? error?.message : 'Server Error';

    return NextResponse.json({ serverError: errorMssg }, { status: 500 });
  }
}
