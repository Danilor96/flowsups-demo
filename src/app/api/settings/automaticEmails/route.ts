import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function GET() {
  try {
    const data = mockDb.automatic_emails.findFirst();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions(49);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const automaticEmails = z.object({
    internetLeadAutoResponse: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    appointmentReminder: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    appointmentReminderTiming: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    appointmentScheduleOnSite: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    appointmentScheduleOnline: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    appointmentRescheduleOnSite: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    appointmentRescheduleOnline: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    soldDealsThankYou: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    soldDealsThankYouTiming: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    sendImmediatelyForProspectIn: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    sendImmediatelyFor: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    vehiclePriceDrop: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    depositPaymentRecipient: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    stipulationRequest: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    appointmentReminderTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    appointmentRescheduleOnlineTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    appointmentRescheduleOnSiteTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    appointmentScheduleOnlineTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    appointmentScheduleOnSiteTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    depositPaymentRecipientTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    internetLeadAutoResponseTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    soldDealsThankYouTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    stipulationRequestTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    vehiclePriceDropTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
  });

  const validatedData = automaticEmails.safeParse({
    internetLeadAutoResponse: formData.get('internetLeadAutoResponse'),
    appointmentReminder: formData.get('appointmentReminder'),
    appointmentReminderTiming: formData.get('appointmentReminderTiming'),
    appointmentScheduleOnSite: formData.get('appointmentScheduleOnSite'),
    appointmentScheduleOnline: formData.get('appointmentScheduleOnline'),
    appointmentRescheduleOnSite: formData.get('appointmentRescheduleOnSite'),
    appointmentRescheduleOnline: formData.get('appointmentRescheduleOnline'),
    soldDealsThankYou: formData.get('soldDealsThankYou'),
    soldDealsThankYouTiming: formData.get('soldDealsThankYouTiming'),
    sendImmediatelyForProspectIn: formData.get('sendImmediatelyForProspectIn'),
    sendImmediatelyFor: formData.get('sendImmediatelyFor'),
    vehiclePriceDrop: formData.get('vehiclePriceDrop'),
    depositPaymentRecipient: formData.get('depositPaymentRecipient'),
    stipulationRequest: formData.get('stipulationRequest'),
    appointmentReminderTemplate: formData.get('appointmentReminderTemplate'),
    appointmentRescheduleOnlineTemplate: formData.get('appointmentRescheduleOnlineTemplate'),
    appointmentRescheduleOnSiteTemplate: formData.get('appointmentRescheduleOnSiteTemplate'),
    appointmentScheduleOnlineTemplate: formData.get('appointmentScheduleOnlineTemplate'),
    appointmentScheduleOnSiteTemplate: formData.get('appointmentScheduleOnSiteTemplate'),
    depositPaymentRecipientTemplate: formData.get('depositPaymentRecipientTemplate'),
    internetLeadAutoResponseTemplate: formData.get('internetLeadAutoResponseTemplate'),
    soldDealsThankYouTemplate: formData.get('soldDealsThankYouTemplate'),
    stipulationRequestTemplate: formData.get('stipulationRequestTemplate'),
    vehiclePriceDropTemplate: formData.get('vehiclePriceDropTemplate'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    internetLeadAutoResponse,
    appointmentReminder,
    appointmentReminderTiming,
    appointmentScheduleOnSite,
    appointmentScheduleOnline,
    appointmentRescheduleOnSite,
    appointmentRescheduleOnline,
    soldDealsThankYou,
    soldDealsThankYouTiming,
    sendImmediatelyForProspectIn,
    sendImmediatelyFor,
    vehiclePriceDrop,
    depositPaymentRecipient,
    stipulationRequest,
    appointmentReminderTemplate,
    appointmentRescheduleOnlineTemplate,
    appointmentRescheduleOnSiteTemplate,
    appointmentScheduleOnlineTemplate,
    appointmentScheduleOnSiteTemplate,
    depositPaymentRecipientTemplate,
    internetLeadAutoResponseTemplate,
    soldDealsThankYouTemplate,
    stipulationRequestTemplate,
    vehiclePriceDropTemplate,
  } = validatedData.data;

  try {
    const returnValue = (data: string) => {
      if (data === '1') return true;

      return false;
    };

    const data = mockDb.automatic_emails.create({
      data: {
        internet_lead_auto_response: returnValue(internetLeadAutoResponse),
        appointment_reminder: returnValue(appointmentReminder),
        appointment_reminder_days: appointmentReminderTiming,
        appointment_scheduled_on_site: returnValue(appointmentScheduleOnSite),
        appointment_rescheduled_on_site: returnValue(appointmentRescheduleOnSite),
        appointment_scheduled_online: returnValue(appointmentScheduleOnline),
        appointment_rescheduled_online: returnValue(appointmentRescheduleOnline),
        sold_deals_thank_you: returnValue(soldDealsThankYou),
        sold_deals_thank_you_days: soldDealsThankYouTiming,
        vehicle_price_drop: returnValue(vehiclePriceDrop),
        customer_status_id: parseInt(sendImmediatelyForProspectIn),
        deposit_payment_receipt: returnValue(depositPaymentRecipient),
        deposit_payment_receipt_send_immediately_id: parseInt(sendImmediatelyFor),
        stipulation_request: returnValue(stipulationRequest),
        appointment_reminder_template_id: appointmentReminderTemplate
          ? parseInt(appointmentReminderTemplate)
          : undefined,
        appointment_reschedule_online_template_id: appointmentRescheduleOnlineTemplate
          ? parseInt(appointmentRescheduleOnlineTemplate)
          : undefined,
        appointment_reschedule_on_site_template_id: appointmentRescheduleOnSiteTemplate
          ? parseInt(appointmentRescheduleOnSiteTemplate)
          : undefined,
        appointment_schedule_online_template_id: appointmentScheduleOnlineTemplate
          ? parseInt(appointmentScheduleOnlineTemplate)
          : undefined,
        appointment_schedule_on_site_template_id: appointmentScheduleOnSiteTemplate
          ? parseInt(appointmentScheduleOnSiteTemplate)
          : undefined,
        deposit_payment_recipient_template_id: depositPaymentRecipientTemplate
          ? parseInt(depositPaymentRecipientTemplate)
          : undefined,
        internet_lead_auto_response_template_id: internetLeadAutoResponseTemplate
          ? parseInt(internetLeadAutoResponseTemplate)
          : undefined,
        sold_deals_thank_you_template_id: soldDealsThankYouTemplate
          ? parseInt(soldDealsThankYouTemplate)
          : undefined,
        stipulation_request_template_id: stipulationRequestTemplate
          ? parseInt(stipulationRequestTemplate)
          : undefined,
        vehicle_price_drop_template_id: vehiclePriceDropTemplate
          ? parseInt(vehiclePriceDropTemplate)
          : undefined,
      },
    });

    return NextResponse.json({ successMessage: 'Settings Successfully Updated', data: data.id });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const permissionsCheck = await checkPermissions(49);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const automaticEmails = z.object({
    id: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    internetLeadAutoResponse: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    appointmentReminder: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    appointmentReminderTiming: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    appointmentScheduleOnSite: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    appointmentScheduleOnline: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    appointmentRescheduleOnSite: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    appointmentRescheduleOnline: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    soldDealsThankYou: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    soldDealsThankYouTiming: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    sendImmediatelyForProspectIn: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    sendImmediatelyFor: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    vehiclePriceDrop: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    depositPaymentRecipient: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    stipulationRequest: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    appointmentReminderTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    appointmentRescheduleOnlineTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    appointmentRescheduleOnSiteTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    appointmentScheduleOnlineTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    appointmentScheduleOnSiteTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    depositPaymentRecipientTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    internetLeadAutoResponseTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    soldDealsThankYouTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    stipulationRequestTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    vehiclePriceDropTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
  });

  const validatedData = automaticEmails.safeParse({
    id: formData.get('id'),
    internetLeadAutoResponse: formData.get('internetLeadAutoResponse'),
    appointmentReminder: formData.get('appointmentReminder'),
    appointmentReminderTiming: formData.get('appointmentReminderTiming'),
    appointmentScheduleOnSite: formData.get('appointmentScheduleOnSite'),
    appointmentScheduleOnline: formData.get('appointmentScheduleOnline'),
    appointmentRescheduleOnSite: formData.get('appointmentRescheduleOnSite'),
    appointmentRescheduleOnline: formData.get('appointmentRescheduleOnline'),
    soldDealsThankYou: formData.get('soldDealsThankYou'),
    soldDealsThankYouTiming: formData.get('soldDealsThankYouTiming'),
    sendImmediatelyForProspectIn: formData.get('sendImmediatelyForProspectIn'),
    sendImmediatelyFor: formData.get('sendImmediatelyFor'),
    vehiclePriceDrop: formData.get('vehiclePriceDrop'),
    depositPaymentRecipient: formData.get('depositPaymentRecipient'),
    stipulationRequest: formData.get('stipulationRequest'),
    appointmentReminderTemplate: formData.get('appointmentReminderTemplate'),
    appointmentRescheduleOnlineTemplate: formData.get('appointmentRescheduleOnlineTemplate'),
    appointmentRescheduleOnSiteTemplate: formData.get('appointmentRescheduleOnSiteTemplate'),
    appointmentScheduleOnlineTemplate: formData.get('appointmentScheduleOnlineTemplate'),
    appointmentScheduleOnSiteTemplate: formData.get('appointmentScheduleOnSiteTemplate'),
    depositPaymentRecipientTemplate: formData.get('depositPaymentRecipientTemplate'),
    internetLeadAutoResponseTemplate: formData.get('internetLeadAutoResponseTemplate'),
    soldDealsThankYouTemplate: formData.get('soldDealsThankYouTemplate'),
    stipulationRequestTemplate: formData.get('stipulationRequestTemplate'),
    vehiclePriceDropTemplate: formData.get('vehiclePriceDropTemplate'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    id,
    internetLeadAutoResponse,
    appointmentReminder,
    appointmentReminderTiming,
    appointmentScheduleOnSite,
    appointmentScheduleOnline,
    appointmentRescheduleOnSite,
    appointmentRescheduleOnline,
    soldDealsThankYou,
    soldDealsThankYouTiming,
    sendImmediatelyForProspectIn,
    sendImmediatelyFor,
    vehiclePriceDrop,
    depositPaymentRecipient,
    stipulationRequest,
    appointmentReminderTemplate,
    appointmentRescheduleOnlineTemplate,
    appointmentRescheduleOnSiteTemplate,
    appointmentScheduleOnlineTemplate,
    appointmentScheduleOnSiteTemplate,
    depositPaymentRecipientTemplate,
    internetLeadAutoResponseTemplate,
    soldDealsThankYouTemplate,
    stipulationRequestTemplate,
    vehiclePriceDropTemplate,
  } = validatedData.data;

  try {
    const returnValue = (data: string) => {
      if (data === '1') return true;

      return false;
    };

    const data = mockDb.automatic_emails.update({
      where: {
        id: parseInt(id),
      },
      data: {
        internet_lead_auto_response: returnValue(internetLeadAutoResponse),
        appointment_reminder: returnValue(appointmentReminder),
        appointment_reminder_days: appointmentReminderTiming,
        appointment_scheduled_on_site: returnValue(appointmentScheduleOnSite),
        appointment_rescheduled_on_site: returnValue(appointmentRescheduleOnSite),
        appointment_scheduled_online: returnValue(appointmentScheduleOnline),
        appointment_rescheduled_online: returnValue(appointmentRescheduleOnline),
        sold_deals_thank_you: returnValue(soldDealsThankYou),
        sold_deals_thank_you_days: soldDealsThankYouTiming,
        vehicle_price_drop: returnValue(vehiclePriceDrop),
        customer_status_id: parseInt(sendImmediatelyForProspectIn),
        deposit_payment_receipt: returnValue(depositPaymentRecipient),
        deposit_payment_receipt_send_immediately_id: parseInt(sendImmediatelyFor),
        stipulation_request: returnValue(stipulationRequest),
        appointment_reminder_template_id: appointmentReminderTemplate
          ? parseInt(appointmentReminderTemplate)
          : undefined,
        appointment_reschedule_online_template_id: appointmentRescheduleOnlineTemplate
          ? parseInt(appointmentRescheduleOnlineTemplate)
          : undefined,
        appointment_reschedule_on_site_template_id: appointmentRescheduleOnSiteTemplate
          ? parseInt(appointmentRescheduleOnSiteTemplate)
          : undefined,
        appointment_schedule_online_template_id: appointmentScheduleOnlineTemplate
          ? parseInt(appointmentScheduleOnlineTemplate)
          : undefined,
        appointment_schedule_on_site_template_id: appointmentScheduleOnSiteTemplate
          ? parseInt(appointmentScheduleOnSiteTemplate)
          : undefined,
        deposit_payment_recipient_template_id: depositPaymentRecipientTemplate
          ? parseInt(depositPaymentRecipientTemplate)
          : undefined,
        internet_lead_auto_response_template_id: internetLeadAutoResponseTemplate
          ? parseInt(internetLeadAutoResponseTemplate)
          : undefined,
        sold_deals_thank_you_template_id: soldDealsThankYouTemplate
          ? parseInt(soldDealsThankYouTemplate)
          : undefined,
        stipulation_request_template_id: stipulationRequestTemplate
          ? parseInt(stipulationRequestTemplate)
          : undefined,
        vehicle_price_drop_template_id: vehiclePriceDropTemplate
          ? parseInt(vehiclePriceDropTemplate)
          : undefined,
      },
    });

    return NextResponse.json({ successMessage: 'Settings Successfully Updated' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
