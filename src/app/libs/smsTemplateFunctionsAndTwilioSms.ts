const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { TemplateVariablesValues } from '@/app/libs/definitions';
import { mockDb } from '@/app/libs/mock-db';
import { parseISO } from 'date-fns';
import { uploadImageForSms } from '@/app/libs/uploadImages.services';

const client = twilio(accountSid, authToken);

const url = process.env.TWILIO_WEBSOCKET_URL;

// replace sms template variables
export const replaceVariables = (sms: string, data: any) => {
  return sms.replace(/{(\w+\.\w+)}/g, (_, key) => {
    const keys = key.split('.');
    return keys.reduce((obj: any, k: any) => (obj ? obj[k] : ''), data);
  });
};

export const dataObject = (
  templateVariablesValues: TemplateVariablesValues,
  appointmentDateStart?: string,
  appointmentDateEnd?: string,
  consentLink?: string,
) => {
  return {
    customer: {
      first_name: templateVariablesValues?.first_name,
      last_name: templateVariablesValues?.last_name,
      email: templateVariablesValues?.email,
      city: templateVariablesValues?.client_address?.city,
      home_phone: templateVariablesValues?.home_phone,
      lead_source: templateVariablesValues?.lead_source?.source,
      middle_name: templateVariablesValues?.middle_initials,
      mobile: templateVariablesValues?.mobile_phone,
      salutation: templateVariablesValues?.salutation,
      state: templateVariablesValues?.client_address?.state.state,
      street: templateVariablesValues?.client_address?.street,
      suffix: templateVariablesValues?.suffix,
      work_phone: templateVariablesValues?.work_phone,
      zip: templateVariablesValues?.client_address?.zip,
      assigned_sales_rep: `${templateVariablesValues?.seller?.name || ''} ${
        templateVariablesValues?.seller?.last_name || ''
      }`,
      assigned_sales_rep_first_name: templateVariablesValues?.seller?.name || '',
      assigned_sales_rep_last_name: templateVariablesValues?.seller?.last_name || '',
      assigned_bdc_rep: `${templateVariablesValues?.bdc?.name || ''} ${
        templateVariablesValues?.bdc?.last_name || ''
      }`,
      assigned_bdc_rep_first_name: templateVariablesValues?.bdc?.name || '',
      assigned_bdc_rep_last_name: templateVariablesValues?.bdc?.last_name || '',
      consent_link: consentLink ? consentLink : '',
    },
    admin: {
      sales_rep_email: templateVariablesValues?.seller?.email || '',
      sales_rep_mobile: templateVariablesValues?.seller?.mobile_phone || '',
      [`today's_date`]: new Date().toISOString(),
    },
    inventory: {
      interested_vehicle: `${
        templateVariablesValues?.interested_vehicle?.vehicle_brands.brand || ''
      } ${templateVariablesValues?.interested_vehicle?.vehicle_models.model || ''}`,
      interested_vehicle_asking_price:
        templateVariablesValues?.interested_vehicle?.title_license?.asking_price || '',
      interested_vehicle_color:
        templateVariablesValues?.interested_vehicle?.exterior_vehicle_colors?.color || '',
      interested_vehicle_make:
        templateVariablesValues?.interested_vehicle?.vehicle_brands.brand || '',
      interested_vehicle_mileage:
        templateVariablesValues?.interested_vehicle?.vehicle_mileages?.mileage || '',
      interested_vehicle_model:
        templateVariablesValues?.interested_vehicle?.vehicle_models.model || '',
      interested_vehicle_new_price:
        templateVariablesValues?.interested_vehicle?.title_license?.buy_now_price || '',
      interested_vehicle_old_price:
        templateVariablesValues?.interested_vehicle?.title_license?.floor_price || '',
      interested_vehicle_price:
        templateVariablesValues?.interested_vehicle?.title_license?.whole_price || '',
      interested_vehicle_trim:
        templateVariablesValues?.interested_vehicle?.vehicle_trim?.trim || '',
      interested_vehicle_vin:
        templateVariablesValues?.interested_vehicle?.vehicle_identification_numbers.vin || '',
      interested_vehicle_year:
        templateVariablesValues?.interested_vehicle?.vehicle_manufacture_years?.year || '',
    },
    appointment: {
      appointment_date: `${dateFormat(5, appointmentDateStart)} - ${dateFormat(
        1,
        appointmentDateEnd,
      )}`,
    },
  };
};

const dateFormat = (format: number, date?: string) => {
  let newDateFormat = {};

  if (date) {
    switch (format) {
      case 1:
        newDateFormat = {
          hour: '2-digit',
          minute: '2-digit',
        };
        break;

      case 2:
        newDateFormat = {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        };
        break;

      case 3:
        newDateFormat = {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        };
        break;

      case 4:
        newDateFormat = {
          month: 'long',
        };
        break;

      case 5:
        newDateFormat = {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        };
        break;
    }

    const dateFormat = new Intl.DateTimeFormat('en-US', newDateFormat);

    return dateFormat.format(new Date(date));
  } else {
    return '';
  }
};

// send a sms (twilio)
export const sendSms = async (
  sms: string,
  to: string,
  senderId: string = '',
  file?: File | null,
  options?: {
    isConsentMessage?: boolean;
  },
  manual: boolean = true,
) => {
  try {
    const statusCallbackUrl = `${url}/smsStatus`;

    const smsMediaUrl = file ? await uploadImageForSms(senderId, file) : null;

    const res = await client.messages.create({
      body: sms,
      from: twilioPhoneNumber,
      to: `+1${to}`,
      mediaUrl: smsMediaUrl ? [smsMediaUrl] : undefined,
      statusCallback: statusCallbackUrl,
    });

    const sentSms = res.body;
    const createdAt = res.dateCreated;

    const customerId = await mockDb.clients.findFirst({
      where: {
        OR: [{ mobile_phone: to }, { home_phone: to }],
      },
    });

    if (customerId && customerId.id) {
      await mockDb.client_sms.create({
        data: {
          message: sentSms,
          message_sid: res.sid,
          sent_by_user: true,
          fileAttachment: file ? { name: file.name, url: smsMediaUrl } : null,
          client_phone_number: to,
          is_consent_message: options?.isConsentMessage ?? undefined,
          manual_sent: manual,
          status_id: 1,
          client_id: customerId.id,
          sender_user_id: senderId ? parseInt(senderId) : null,
          date_sent: new Date(),
        },
      });
    } else {
      await mockDb.client_sms.create({
        data: {
          message: sms,
          message_sid: res.sid,
          sent_by_user: true,
          is_consent_message: options?.isConsentMessage ?? undefined,
          status_id: 1,
          client_id: null,
          client_phone_number: to,
          sender_user_id: senderId ? parseInt(senderId) : null,
          date_sent: new Date(),
        },
      });

      await mockDb.awaiting_unknow_client.update({
        where: {
          mobile_phone_number: to,
        },
        data: {
          last_activity: new Date(),
        },
      });
    }

    return res;
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
};

interface SendSmsForBulkActionsProps {
  sms: string;
  to: string;
  smsMediaUrl: string | null;
}

export const sendSmsForBulkActions = async ({
  sms,
  to,
  smsMediaUrl,
}: SendSmsForBulkActionsProps) => {
  try {
    const statusCallbackUrl = `${url}/smsStatus`;

    const res = await client.messages.create({
      body: sms,
      from: twilioPhoneNumber,
      to: `+1${to}`,
      mediaUrl: smsMediaUrl ? [smsMediaUrl] : undefined,
      statusCallback: statusCallbackUrl,
    });

    return res;
  } catch (error) {
    console.log(' Error sending to +1${to} ', error);

    return null;
  }
};

interface saveSmsForBulkActionsProps {
  smsInstance: any;
  to: string;
  senderId: string;
  file?: File | null;
  smsMediaUrl: string | null;
}

export const saveSmsForBulkActions = async ({
  smsInstance,
  to,
  senderId,
  file,
  smsMediaUrl,
}: saveSmsForBulkActionsProps) => {
  try {
    const sentSms = smsInstance.body;
    const createdAt = smsInstance.dateCreated;

    const customerId = await mockDb.clients.findFirst({
      where: {
        OR: [{ mobile_phone: to }, { home_phone: to }],
      },
    });

    if (customerId && customerId.id) {
      await mockDb.client_sms.create({
        data: {
          manual_sent: false,
          message: sentSms,
          message_sid: smsInstance.sid,
          sent_by_user: true,
          fileAttachment: file ? [{ name: file.name, url: smsMediaUrl }] : null,
          client_phone_number: to,
          status_id: 1,
          client_id: customerId.id,
          sender_user_id: parseInt(senderId),
          date_sent: new Date(),
        },
      });
    } else {
      await mockDb.client_sms.create({
        data: {
          message: sentSms,
          message_sid: smsInstance.sid,
          sent_by_user: true,
          status_id: 1,
          client_id: null,
          client_phone_number: to,
          sender_user_id: parseInt(senderId),
          date_sent: new Date(),
        },
      });

      await mockDb.awaiting_unknow_client.update({
        where: {
          mobile_phone_number: to,
        },
        data: {
          last_activity: new Date(),
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.log('Error saving sms ', error);
    return { success: false, error: 'Error saving sms' };
  }
};

export const sendConsentSms = async ({
  to,
  consentLogId,
}: {
  to: string;
  consentLogId: number;
}) => {
  try {
    const statusCallbackUrl = `${url}/smsStatus`;

    const sms = `Security Verification: We received a request using this phone number. To confirm you submitted this form and agree to our consent policy (data sharing and credit report authorization), please reply:

YES (Y/SI/S) to confirm and proceed. NO (N) if this wasn't you.`;

    const res = await client.messages.create({
      body: sms,
      from: twilioPhoneNumber,
      to: `+1${to}`,
      // mediaUrl: smsMediaUrl ? [smsMediaUrl] : undefined,
      statusCallback: statusCallbackUrl,
    });

    const customerId = await mockDb.clients.findFirst({
      where: {
        OR: [{ mobile_phone: to }, { home_phone: to }],
      },
    });

    const message = await mockDb.client_sms.create({
      data: {
        message: sms,
        sent_by_user: true,
        manual_sent: false,
        message_sid: res.sid,
        client_phone_number: to,
        is_consent_message: true,
        status_id: 1,
        client_id: customerId?.id ?? null,
        sender_user_id: null,
        date_sent: new Date(),
      },
    });

    await mockDb.customer_consent_logs.update({
      where: {
        id: consentLogId,
      },
      data: {
        sentSmsVerificationRecordId: message.id,
      },
    });

    return message.id;
  } catch (error) {
    console.log(error);

    throw new Error('Error trying to send consent message');
  }
};
