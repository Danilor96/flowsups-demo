import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import {
  ActivityType,
  sellerActivityEventEmitterAsync,
} from '@/app/libs/services/salesPointsService';
import { SMS_STATUS_ID } from '@/app/libs/definitions';
import { checkPermissions } from '@/app/libs/auth-helpers';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';

const url = process.env.TWILIO_WEBSOCKET_URL;

const buildUserPick = (user: any) => ({
  name: user.name,
  last_name: user.last_name,
  id: user.id,
});

const buildClientMessage = (client: any) => {
  if (!client) return null;

  const seller = client.seller || {};
  const bdc = client.bdc || {};

  return {
    id: client.id,
    email: client.email,
    last_name: client.last_name,
    mobile_phone: client.mobile_phone,
    first_name: client.first_name,
    lead_temperature_id: client.lead_temperature_id,
    seller_id: client.seller_id,
    bdc_id: client.bdc_id,
    lead: (client.lead || [])
      .filter((lead: any) => lead.is_active)
      .map((lead: any, index: number) => ({
        id: client.id + index,
        customer_status: lead.customer_status || null,
      })),
    seller: seller.id
      ? {
          id: seller.id,
          name: seller.name,
          last_name: seller.last_name,
          username: seller.username,
        }
      : null,
    bdc: bdc.id
      ? {
          id: bdc.id,
          name: bdc.name,
          last_name: bdc.last_name,
          username: bdc.username,
        }
      : null,
    conversation: null,
  };
};

const buildUnknownCustomer = (unknown: any) => ({
  id: unknown.id,
  mobile_phone_number: unknown.mobile_phone_number,
  conversation: null,
});

export async function GET(request: Request, { params }: { params: { mobilePhone: string } }) {
  const mobilePhone = params.mobilePhone;

  try {
    const data = mockDb.client_sms.findMany({
      where: {
        OR: [
          {
            client_message: {
              mobile_phone: mobilePhone,
            },
          },
          {
            unregistered_customer: {
              some: {
                mobile_phone_number: mobilePhone,
              },
            },
          },
        ],
      },
      orderBy: {
        date_sent: 'asc',
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { mobilePhone: string } }) {
  const permissionsCheck = await checkPermissions(64);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const session = await auth();
  const userSession = session?.user;

  const mobilePhone = params.mobilePhone;

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

  const messageSchema = z
    .object({
      clientNumber: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(10, 'Please, enter a 10 digits mobile number')
        .max(10, 'Please, enter a 10 digits mobile number'),
      clientId: z.string({ invalid_type_error: 'Please enter a valid value' }).nullish(),
      message: z.string({ invalid_type_error: 'Please enter a valid value' }).nullish(),
      senderId: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      fileAtt: z
        .array(
          z
            .instanceof(File)
            .refine((file) => contentTypeAccepted.includes(file.type), {
              message: 'Invalid image file type',
              path: ['message'],
            })
            .refine((file) => file.size < fileSizeLimit, {
              message: 'File size should not exceed 5MB',
              path: ['message'],
            }),
        )
        .nullish(),
      unregisteredCustomer: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .nullish(),
    })
    .refine((messageSchema) => messageSchema.message || messageSchema.fileAtt, {
      message: 'Enter at least a message or a file',
      path: ['message'],
    });

  const validatedData = messageSchema.safeParse({
    clientNumber: formData.get('clientNumber'),
    clientId: formData.get('clientId'),
    message: formData.get('message'),
    senderId: formData.get('senderId'),
    fileAtt: formData.getAll('file'),
    unregisteredCustomer: formData.get('unregisteredCustomer'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { clientNumber, message, senderId, unregisteredCustomer, clientId } = validatedData.data;

  try {
    const businesPhoneNumberActive = mockDb.business_phone_numbers.findFirst({
      where: {
        is_publishing_number: true,
      },
    });

    if (!businesPhoneNumberActive) {
      return NextResponse.json({ serverError: 'Business Phone number not found' }, { status: 404 });
    }

    const files = formData.getAll('file') as File[] | null;

    const smsMediaUrl = files
      ? files.map((file) => `https://mock.storage/flowsups/${senderId}/${encodeURIComponent(file.name)}`)
      : [];

    const statusCallbacUrl = `${url}/smsStatus`;

    const res = {
      body: message ? message : '',
      sid: `SMmock${Date.now()}`,
    };

    const sms = res.body;

    if (!unregisteredCustomer && clientId) {
      const lastMessage = mockDb.client_sms.findFirst({
        where: {
          client_id: parseInt(clientId),
        },
        orderBy: {
          date_sent: 'desc',
        },
      });

      const client = mockDb.clients.findUnique({
        where: {
          id: parseInt(clientId),
        },
      });

      const sender = mockDb.users.findUnique({
        where: {
          id: parseInt(senderId),
        },
      });

      mockDb.client_sms.create({
        data: {
          message: sms,
          message_sid: res.sid,
          sent_by_user: true,
          manual_sent: true,
          sent: true,
          delivered: false,
          failed: false,
          sender_user_id: parseInt(senderId),
          fileAttachment: files?.map((file, i) => ({
            name: file.name,
            url: smsMediaUrl ? smsMediaUrl[i] : '',
          })),
          client_phone_number: clientNumber,
          status_id:
            lastMessage?.status_id === SMS_STATUS_ID.REPLIED
              ? SMS_STATUS_ID.REPLIED
              : SMS_STATUS_ID.READ,
          client_id: parseInt(clientId),
          date_sent: new Date(),
          is_consent_message: false,
          read_by: [],
          has_customer_reply: false,
          is_reply_to_user: false,
          user: sender ? [buildUserPick(sender)] : [],
          client_message: buildClientMessage(client),
          unregistered_customer: [],
        },
      });

      mockDb.leads.updateMany({
        where: {
          customer_id: parseInt(clientId),
          is_active: true,
          customer_status_id: {
            in: [CustomersStatuses.New, CustomersStatuses.Lost]
          }
        },
        data: {
          customer_status_id: CustomersStatuses.Contact_Attempt
        },
      });
    } else {
      const lastMessage = mockDb.client_sms.findFirst({
        where: {
          unregistered_customer: {
            some: {
              mobile_phone_number: mobilePhone,
            },
          },
        },
        orderBy: {
          date_sent: 'desc',
        },
      });

      const sender = mockDb.users.findUnique({
        where: {
          id: parseInt(senderId),
        },
      });

      const unknownCustomer = mockDb.awaiting_unknow_client.findFirst({
        where: {
          mobile_phone_number: mobilePhone,
        },
      });

      mockDb.client_sms.create({
        data: {
          message: sms,
          message_sid: res.sid,
          sent_by_user: true,
          manual_sent: true,
          sent: true,
          delivered: false,
          failed: false,
          sender_user_id: parseInt(senderId),
          status_id:
            lastMessage?.status_id === SMS_STATUS_ID.REPLIED
              ? SMS_STATUS_ID.REPLIED
              : SMS_STATUS_ID.READ,
          client_id: null,
          client_phone_number: mobilePhone,
          date_sent: new Date(),
          is_consent_message: false,
          read_by: [],
          has_customer_reply: false,
          is_reply_to_user: false,
          user: sender ? [buildUserPick(sender)] : [],
          client_message: null,
          unregistered_customer: unknownCustomer ? [buildUnknownCustomer(unknownCustomer)] : [],
        },
      });

      if (unknownCustomer) {
        mockDb.awaiting_unknow_client.update({
          where: {
            mobile_phone_number: mobilePhone,
          },
          data: {
            last_activity: new Date(),
          },
        });
      } else {
        mockDb.awaiting_unknow_client.create({
          data: {
            mobile_phone_number: mobilePhone,
            last_activity: new Date(),
            created_at: new Date(),
          },
        });
      }
    }

    if (userSession?.id) {
      sellerActivityEventEmitterAsync({
        userId: userSession.id,
        activityType: ActivityType.SMS_SENT,
      });
    }

    return NextResponse.json({ successMessage: 'Sending Message' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
