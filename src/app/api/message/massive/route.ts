import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCustomerSmsTemplateVariablesValues } from '@/app/libs/data';
import {
  dataObject,
  replaceVariables,
} from '@/app/libs/smsTemplateFunctionsAndTwilioSms';
import { createEvent } from '@/app/libs/events/events';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions(58);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const contentTypeAccepted = [
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/png',
    'image/heic',
    'image/heif',
    'image/tiff',
    'image/bmp',
  ];

  const fileSizeLimit = 5 * 1024 * 1024;

  const massiveMessageSchema = z
    .object({
      recipients: z.array(z.number({ invalid_type_error: 'Please enter a valid value' })),
      message: z.string({ invalid_type_error: 'Please enter a valid value' }).nullish(),
      senderId: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      fileAtt: z
        .instanceof(File)
        .refine((file) => contentTypeAccepted.includes(file.type), {
          message: 'Invalid image file type',
          path: ['message'],
        })
        .refine((file) => file.size < fileSizeLimit, {
          message: 'File size should not exceed 5MB',
          path: ['message'],
        })
        .nullish(),
    })
    .refine((data) => data.message || data.fileAtt, {
      message: 'Please enter a value',
      path: ['message'],
    });

  const dataArray = formData.get('recipientsArray');

  const validatedData = massiveMessageSchema.safeParse({
    recipients: typeof dataArray === 'string' && JSON.parse(dataArray),
    message: formData.get('message'),
    senderId: formData.get('senderId'),
    fileAtt: formData.get('file'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { recipients, senderId, fileAtt, message } = validatedData.data;

  try {
    const file = formData.get('file') as File | null;
    const smsMediaUrl = file
      ? `https://mock.storage/flowsups/${senderId}/${encodeURIComponent(file.name)}`
      : null;

    const customers = mockDb.clients.findMany({
      where: {
        id: {
          in: recipients,
        },
        OR: [
          {
            mobile_phone: {
              not: null,
            },
          },
          {
            home_phone: {
              not: null,
            },
          },
          {
            work_phone: {
              not: null,
            },
          },
        ],
      },
    });

    const clientBulkSmsCreated = mockDb.client_Bulk_sms.create({
      data: {
        total_recipients: customers.length,
        sent_by_user_id: parseInt(senderId),
        failed_to_send: 0,
        successfully_sent: 0,
        message: message || '',
      },
    });

    const successfulSends = [];
    const failedSends = [];

    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];

      const customerVariablesValues = await getCustomerSmsTemplateVariablesValues(
        customer.id.toString(),
      );

      const dataObj = dataObject(customerVariablesValues);

      const sms = replaceVariables(message || '', dataObj);

      if (customer) {
        const defaultPhoneNumber = customer.mobile_default
          ? customer.mobile_phone
          : customer.home_default
          ? customer.home_phone
          : customer.work_phone;

        const to = defaultPhoneNumber || customer.mobile_phone || '';

        if (!to) {
          failedSends.push(to);
          continue;
        }

        const smsInstance = {
          body: sms,
          sid: `SMmock${Date.now()}${i}`,
        };

        const sender = mockDb.users.findUnique({
          where: {
            id: parseInt(senderId),
          },
        });

        mockDb.client_sms.create({
          data: {
            message: smsInstance.body,
            message_sid: smsInstance.sid,
            sent_by_user: true,
            manual_sent: false,
            sent: true,
            delivered: true,
            failed: false,
            sender_user_id: parseInt(senderId),
            fileAttachment: file ? [{ name: file.name, url: smsMediaUrl || '' }] : undefined,
            client_phone_number: to,
            status_id: 1,
            client_id: customer.id,
            date_sent: new Date(),
            is_consent_message: false,
            read_by: [],
            has_customer_reply: false,
            is_reply_to_user: false,
            user: sender
              ? [{ id: sender.id, name: sender.name, last_name: sender.last_name }]
              : [],
            client_message: null,
            unregistered_customer: [],
          },
        });

        mockDb.client_has_lead.create({
          data: {
            created_at: new Date(),
            assigned_to_id: customer?.seller_id ? customer.seller_id : undefined,
            client_id: customer.id,
            status_id: 2,
            created_by_id: parseInt(senderId),
            lead_id: 2,
          },
        });

        const description = 'Sms sent';

        await createEvent(description, parseInt(senderId), customer.id, new Date());

        successfulSends.push(to);
      }
    }

    mockDb.client_Bulk_sms.update({
      where: {
        id: clientBulkSmsCreated.id,
      },
      data: {
        failed_to_send: failedSends.length,
        successfully_sent: successfulSends.length,
        completed_at: new Date().toISOString(),
      },
    });

    return NextResponse.json({ successMessage: 'Messages Successfully Sent' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
