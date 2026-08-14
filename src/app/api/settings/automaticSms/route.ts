import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function GET() {
  try {
    const data = mockDb.automatic_sms.findFirst({
      select: {
        id: true,
        credit_app: true,
        consent_sms: true,
        consent_sms_template_id: true,
        appointment_confirmation: true,
        appointment_confirmation_template_id: true,
        credit_app_template_id: true,
        appointment_reminder: true,
        stipulation_request: true,
        appointment_reminder_timing: true,
        appointment_schedule_on_site: true,
        appointment_schedule_online: true,
        appointment_reschedule_onSite: true,
        appointment_reschedule_online: true,
        appointment_reminder_template_id: true,
        appointment_schedule_on_site_template_id: true,
        appointment_schedule_online_template_id: true,
        appointment_reschedule_onSite_template_id: true,
        appointment_reschedule_online_template_id: true,
        stipulation_request_template_id: true,
      },
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions(50);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const automaticSmsSchema = z.object({
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
    stipulationRequest: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    appointmentReminderTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    appointmentScheduleOnSiteTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    appointmentScheduleOnlineTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    appointmentRescheduleOnSiteTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    appointmentRescheduleOnlineTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    stipulationRequestTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    consentSms: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    consentSmsTemplate: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    appointmentConfirmation: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    appointmentConfirmationTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
  });

  const validatedData = automaticSmsSchema.safeParse({
    appointmentReminder: formData.get('appointmentReminder'),
    appointmentReminderTiming: formData.get('appointmentReminderTiming'),
    appointmentScheduleOnSite: formData.get('appointmentScheduleOnSite'),
    appointmentScheduleOnline: formData.get('appointmentScheduleOnline'),
    appointmentRescheduleOnSite: formData.get('appointmentRescheduleOnSite'),
    appointmentRescheduleOnline: formData.get('appointmentRescheduleOnline'),
    stipulationRequest: formData.get('stipulationRequest'),
    appointmentReminderTemplate: formData.get('appointmentReminderTemplate'),
    appointmentScheduleOnSiteTemplate: formData.get('appointmentScheduleOnSiteTemplate'),
    appointmentScheduleOnlineTemplate: formData.get('appointmentScheduleOnlineTemplate'),
    appointmentRescheduleOnSiteTemplate: formData.get('appointmentRescheduleOnSiteTemplate'),
    appointmentRescheduleOnlineTemplate: formData.get('appointmentRescheduleOnlineTemplate'),
    stipulationRequestTemplate: formData.get('stipulationRequestTemplate'),
    consentSms: formData.get('consentSms'),
    consentSmsTemplate: formData.get('consentSmsTemplate'),
    appointmentConfirmation: formData.get('appointmentConfirmation'),
    appointmentConfirmationTemplate: formData.get('appointmentConfirmationTemplate'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    appointmentReminder,
    appointmentReminderTiming,
    appointmentScheduleOnSite,
    appointmentScheduleOnline,
    appointmentRescheduleOnSite,
    appointmentRescheduleOnline,
    stipulationRequest,
    appointmentReminderTemplate,
    appointmentScheduleOnSiteTemplate,
    appointmentScheduleOnlineTemplate,
    appointmentRescheduleOnSiteTemplate,
    appointmentRescheduleOnlineTemplate,
    stipulationRequestTemplate,
    consentSms,
    consentSmsTemplate,
    appointmentConfirmation,
    appointmentConfirmationTemplate,
  } = validatedData.data;

  try {
    const returnValue = (data: string) => {
      if (data === '1') return true;

      return false;
    };

    const returnId = (templateId: string | null) => {
      if (templateId) {
        return parseInt(templateId);
      }

      return;
    };

    const data = mockDb.automatic_sms.create({
      data: {
        appointment_reminder: returnValue(appointmentReminder),
        appointment_reminder_timing: appointmentReminderTiming,
        appointment_schedule_on_site: returnValue(appointmentScheduleOnSite),
        appointment_schedule_online: returnValue(appointmentScheduleOnline),
        appointment_reschedule_onSite: returnValue(appointmentRescheduleOnSite),
        appointment_reschedule_online: returnValue(appointmentRescheduleOnline),
        stipulation_request: returnValue(stipulationRequest),
        appointment_reminder_template_id: returnId(appointmentReminderTemplate),
        appointment_schedule_on_site_template_id: returnId(appointmentScheduleOnSiteTemplate),
        appointment_schedule_online_template_id: returnId(appointmentScheduleOnlineTemplate),
        appointment_reschedule_onSite_template_id: returnId(appointmentRescheduleOnSiteTemplate),
        appointment_reschedule_online_template_id: returnId(appointmentRescheduleOnlineTemplate),
        stipulation_request_template_id: returnId(stipulationRequestTemplate),
        consent_sms: returnValue(consentSms),
        consent_sms_template_id: returnId(consentSmsTemplate),
        appointment_confirmation: returnValue(appointmentConfirmation),
        appointment_confirmation_template_id: returnId(appointmentConfirmationTemplate),
      },
    });

    return NextResponse.json({ successMessage: 'Settings Successfully Updated', data: data.id });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const permissionsCheck = await checkPermissions(50);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const automaticSmsSchema = z.object({
    id: z
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
    stipulationRequest: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    appointmentReminderTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    appointmentScheduleOnSiteTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    appointmentScheduleOnlineTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    appointmentRescheduleOnSiteTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    appointmentRescheduleOnlineTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    stipulationRequestTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    consentSms: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    consentSmsTemplate: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    appointmentConfirmation: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    appointmentConfirmationTemplate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
  });

  const validatedData = automaticSmsSchema.safeParse({
    id: formData.get('id'),
    appointmentReminder: formData.get('appointmentReminder'),
    appointmentReminderTiming: formData.get('appointmentReminderTiming'),
    appointmentScheduleOnSite: formData.get('appointmentScheduleOnSite'),
    appointmentScheduleOnline: formData.get('appointmentScheduleOnline'),
    appointmentRescheduleOnSite: formData.get('appointmentRescheduleOnSite'),
    appointmentRescheduleOnline: formData.get('appointmentRescheduleOnline'),
    stipulationRequest: formData.get('stipulationRequest'),
    appointmentReminderTemplate: formData.get('appointmentReminderTemplate'),
    appointmentScheduleOnSiteTemplate: formData.get('appointmentScheduleOnSiteTemplate'),
    appointmentScheduleOnlineTemplate: formData.get('appointmentScheduleOnlineTemplate'),
    appointmentRescheduleOnSiteTemplate: formData.get('appointmentRescheduleOnSiteTemplate'),
    appointmentRescheduleOnlineTemplate: formData.get('appointmentRescheduleOnlineTemplate'),
    stipulationRequestTemplate: formData.get('stipulationRequestTemplate'),
    consentSms: formData.get('consentSms'),
    consentSmsTemplate: formData.get('consentSmsTemplate'),
    appointmentConfirmation: formData.get('appointmentConfirmation'),
    appointmentConfirmationTemplate: formData.get('appointmentConfirmationTemplate'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    id,
    appointmentReminder,
    appointmentReminderTiming,
    appointmentScheduleOnSite,
    appointmentScheduleOnline,
    appointmentRescheduleOnSite,
    appointmentRescheduleOnline,
    stipulationRequest,
    appointmentReminderTemplate,
    appointmentScheduleOnSiteTemplate,
    appointmentScheduleOnlineTemplate,
    appointmentRescheduleOnSiteTemplate,
    appointmentRescheduleOnlineTemplate,
    stipulationRequestTemplate,
    consentSms,
    consentSmsTemplate,
    appointmentConfirmation,
    appointmentConfirmationTemplate,
  } = validatedData.data;

  try {
    const returnValue = (data: string) => {
      if (data === '1') return true;

      return false;
    };

    const returnId = (templateId: string | null) => {
      if (templateId) {
        return parseInt(templateId);
      }

      return;
    };

    console.log(consentSmsTemplate);

    const data = mockDb.automatic_sms.update({
      where: {
        id: parseInt(id),
      },
      data: {
        appointment_reminder: returnValue(appointmentReminder),
        appointment_reminder_timing: appointmentReminderTiming,
        appointment_schedule_on_site: returnValue(appointmentScheduleOnSite),
        appointment_schedule_online: returnValue(appointmentScheduleOnline),
        appointment_reschedule_onSite: returnValue(appointmentRescheduleOnSite),
        appointment_reschedule_online: returnValue(appointmentRescheduleOnline),
        stipulation_request: returnValue(stipulationRequest),
        appointment_reminder_template_id: returnId(appointmentReminderTemplate),
        appointment_schedule_on_site_template_id: returnId(appointmentScheduleOnSiteTemplate),
        appointment_schedule_online_template_id: returnId(appointmentScheduleOnlineTemplate),
        appointment_reschedule_onSite_template_id: returnId(appointmentRescheduleOnSiteTemplate),
        appointment_reschedule_online_template_id: returnId(appointmentRescheduleOnlineTemplate),
        stipulation_request_template_id: returnId(stipulationRequestTemplate),
        consent_sms: returnValue(consentSms),
        consent_sms_template_id: returnId(consentSmsTemplate),
        appointment_confirmation: returnValue(appointmentConfirmation),
        appointment_confirmation_template_id: returnId(appointmentConfirmationTemplate),
      },
    });

    return NextResponse.json({ successMessage: 'Settings Successfully Updated' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
