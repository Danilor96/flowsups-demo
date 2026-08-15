const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
import { NextResponse } from 'next/server';
import { mockDb } from '@/app/libs/mock-db';
import { z } from 'zod';
import twilio from 'twilio';
import { createEvent } from '@/app/libs/events/events';
import { dataObject, replaceVariables, sendSms } from '@/app/libs/smsTemplateFunctionsAndTwilioSms';
import { getCustomerSmsTemplateVariablesValues } from '@/app/libs/data';
import { checkPermissions } from '@/app/libs/auth-helpers';

const client = twilio(accountSid, authToken);

const url = process.env.TWILIO_WEBSOCKET_URL;

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions([72, 63]);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const customerId = parseInt(params.id);
  const formData = await request.formData();

  const consentSchema = z.object({
    mssg: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    senderId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    sentAt: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    sendToNumber: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    consentLink: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = consentSchema.safeParse({
    mssg: formData.get('mssg'),
    senderId: formData.get('senderId'),
    sentAt: formData.get('sentAt'),
    sendToNumber: formData.get('sendToNumber'),
    consentLink: formData.get('consentLink'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { mssg, senderId, sentAt, sendToNumber, consentLink } = validatedData.data;

  try {
    const clientData = mockDb.clients.findUnique({
      where: {
        id: customerId,
      },
    });

    const customerVariablesValues = await getCustomerSmsTemplateVariablesValues(
      customerId.toString(),
    );

    const dataObj = dataObject(customerVariablesValues, undefined, undefined, consentLink);

    const message = replaceVariables(mssg, dataObj);

    await sendSms(message, sendToNumber, senderId, null, { isConsentMessage: true }, false);

    const customer = mockDb.clients.update({
      where: {
        id: customerId,
      },
      data: {
        consent_sent: true,
      },
    });

    await createEvent('Consent sent', parseInt(senderId), customerId, new Date(sentAt));

    return NextResponse.json({ successMessage: 'Consent Sent' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
