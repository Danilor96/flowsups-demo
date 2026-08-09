const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const smsRecipient = process.env.SMS_RECIPIENT || '';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { z } from 'zod';
import { uploadImageForSms } from '@/app/libs/uploadImages.services';
import { auth } from '@/auth';
import {
  ActivityType,
  sellerActivityEventEmitterAsync,
} from '@/app/libs/services/salesPointsService';
import { SMS_STATUS_ID } from '@/app/libs/definitions';
import { checkPermissions } from '@/app/libs/auth-helpers';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';

const url = process.env.TWILIO_WEBSOCKET_URL;

const client = twilio(accountSid, authToken);

export async function GET(request: Request, { params }: { params: { mobilePhone: string } }) {
  const mobilePhone = params.mobilePhone;

  try {
    const data = await prisma?.client_sms.findMany({
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
      include: {
        user: {
          select: {
            name: true,
            last_name: true,
            id: true,
          },
        },
        client_message: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
            mobile_phone: true,
            id: true,
          },
        },
        unregistered_customer: {
          select: {
            mobile_phone_number: true,
            id: true,
          },
        },
      },
      orderBy: {
        date_sent: 'asc',
      },
    });

    //await prisma.$disconnect();

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

  // proximamente se debe agregar por el bussines id (multi tenant)
  try {
    const businesPhoneNumberActive = await prisma?.business_phone_numbers.findFirst({
      where: {
        is_publishing_number: true,
      },
    });

    if (!businesPhoneNumberActive) {
      return NextResponse.json({ serverError: 'Business Phone number not found' }, { status: 404 });
    }

    const files = formData.getAll('file') as File[] | null;

    const smsMediaUrl = files
      ? await Promise.all(files.map((file) => uploadImageForSms(senderId, file)))
      : [];

    const statusCallbacUrl = `${url}/smsStatus`;

    const res = await client.messages.create({
      body: message ? message : '',
      from: businesPhoneNumberActive?.phone_number,
      to: `+1${clientNumber}`,
      // to: smsRecipient,
      mediaUrl: smsMediaUrl,
      statusCallback: statusCallbacUrl,
    });

    const sms = res.body;

    if (!unregisteredCustomer && clientId) {
      const lastMessage = await prisma.client_sms.findFirst({
        where: {
          client_id: parseInt(clientId),
        },
        orderBy: {
          date_sent: 'desc',
        },
      });

      const createdSms = await prisma?.client_sms.create({
        data: {
          message: sms,
          message_sid: res.sid,
          sent_by_user: true,
          manual_sent: true,
          sender_user: {
            connect: {
              id: parseInt(senderId),
          }},
          fileAttachment: files?.map((file, i) => ({
            name: file.name,
            url: smsMediaUrl ? smsMediaUrl[i] : '',
          })),
          client_phone_number: clientNumber,
          status: {
            connect: {
              id:
                lastMessage?.status_id === SMS_STATUS_ID.REPLIED
                  ? SMS_STATUS_ID.REPLIED
                  : SMS_STATUS_ID.READ,
            },
          },
          client_message: {
            connect: {
              id: parseInt(clientId),
            },
          },
          user: {
            connect: {
              id: parseInt(senderId),
            },
          },
        },
      });
      
      await prisma.leads.updateMany({
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
      const lastMessage = await prisma.client_sms.findFirst({
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
      const createdSms = await prisma?.client_sms.create({
        data: {
          message: sms,
          message_sid: res.sid,
          sent_by_user: true,
          manual_sent: true,
          sender_user: {
            connect: {
              id: parseInt(senderId),
            }
          },
          status: {
            connect: {
              id:
                lastMessage?.status_id === SMS_STATUS_ID.REPLIED
                  ? SMS_STATUS_ID.REPLIED
                  : SMS_STATUS_ID.READ,
            },
          },
          unregistered_customer: {
            connect: {
              mobile_phone_number: mobilePhone,
            },
          },
          user: {
            connect: {
              id: parseInt(senderId),
            },
          },
        },
      });
      const unknowCustomer = await prisma.awaiting_unknow_client.update({
        where: {
          mobile_phone_number: mobilePhone,
        },
        data: {
          last_activity: new Date(),
        },
      });
    }

    // logic for assigning points to sellers
    if (userSession?.id) {
      // event is sent to the socket server to run the seller activity counter in the background without adding latency to the current response.
      sellerActivityEventEmitterAsync({
        userId: userSession.id,
        activityType: ActivityType.SMS_SENT,
      });
    }

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Sending Message' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
