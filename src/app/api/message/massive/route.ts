import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCustomerSmsTemplateVariablesValues } from '@/app/libs/data';
import {
  dataObject,
  replaceVariables,
  saveSmsForBulkActions,
  sendSms,
  sendSmsForBulkActions,
} from '@/app/libs/smsTemplateFunctionsAndTwilioSms';
import { createEvent } from '@/app/libs/events/events';
import { uploadImageForSms } from '@/app/libs/uploadImages.services';
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
    const smsMediaUrl = file ? await uploadImageForSms(senderId, file) : null;

    const customers = await prisma.clients.findMany({
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
      select: {
        id: true,
        mobile_phone: true,
        home_phone: true,
        work_phone: true,
        mobile_default: true,
        home_default: true,
        work_default: true,
        seller_id: true,
      },
    });

    const clientBulkSmsCreated = await prisma.client_Bulk_sms.create({
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

        // await sendSms(sms, defaultPhoneNumber || customer.mobile_phone, senderId, file);
        const smsResponse = await sendSmsForBulkActions({
          sms,
          to: defaultPhoneNumber || customer.mobile_phone || '',
          smsMediaUrl,
        });

        if (!smsResponse) {
          failedSends.push(defaultPhoneNumber || customer.mobile_phone);
        }
        if (smsResponse) {
          await saveSmsForBulkActions({
            smsInstance: smsResponse,
            to: defaultPhoneNumber || customer.mobile_phone || '',
            senderId,
            smsMediaUrl,
            file,
          });

          await prisma.client_has_lead.create({
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

          successfulSends.push(defaultPhoneNumber || customer.mobile_phone);
        }
      }
    }

    await prisma.client_Bulk_sms.update({
      where: {
        id: clientBulkSmsCreated.id,
      },
      data: {
        failed_to_send: failedSends.length,
        successfully_sent: successfulSends.length,
        completed_at: new Date().toISOString(),
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Messages Successfully Sent' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
