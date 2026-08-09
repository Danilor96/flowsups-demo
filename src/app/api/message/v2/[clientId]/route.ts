const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const smsRecipient = process.env.SMS_RECIPIENT || '';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import twilio from 'twilio';

const url = process.env.TWILIO_WEBSOCKET_URL;

const client = twilio(accountSid, authToken);

export async function GET(request: Request, { params }: { params: { clientId: string } }) {
  const clientId = parseInt(params.clientId);
  if (!clientId || isNaN(clientId)) {
    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }

  try {
    const data = await prisma?.client_sms.findMany({
      where: {
        OR: [
          {
            client_id: clientId
          }
          // {
          //   unregistered_customer: {
          //     some: {
          //       mobile_phone_number: mobilePhone,
          //     },
          //   },
          // },
        ]
      },
      include: {
        user: {
          select: {
            name: true,
            last_name: true,
            id: true
          }
        },
        client_message: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
            mobile_phone: true,
            id: true
          }
        },
        unregistered_customer: {
          select: {
            mobile_phone_number: true,
            id: true
          }
        }
      },
      orderBy: {
        date_sent: 'asc'
      }
    });

    //await prisma.$disconnect();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}