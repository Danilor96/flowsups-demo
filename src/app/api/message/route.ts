import { AllSms, SMS_STATUS_ID } from '@/app/libs/definitions';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { Roles } from '@/app/libs/definitions/users/users';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();

    const userRoleId = session?.user.user_has[0].role_id;
    const userId = session?.user.id;

    const adminRoles = [
      Roles.Superuser,
      Roles.Administrator,
      Roles.SalesManager,
      Roles.FinanceManager,
    ];

    const isAdmin = !!userRoleId && adminRoles.includes(userRoleId);

    const data = await prisma.client_sms.findMany({
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
            lead_temperature_id: true,
            id: true,
            email: true,
            mobile_phone: true,
            lead: {
              where: {
                is_active: true,
              },
              select: {
                id: true,
                customer_status: true,
              },
            },
            // client_status: {
            //   select: {
            //     status: true,
            //   },
            // },
            seller: {
              select: {
                id: true,
                name: true,
                last_name: true,
                username: true,
              },
            },
            bdc: {
              select: {
                id: true,
                name: true,
                last_name: true,
                username: true,
              },
            },
            conversation: true,
          },
        },
        unregistered_customer: {
          select: {
            id: true,
            mobile_phone_number: true,
            conversation: true,
          },
        },
      },
      orderBy: {
        date_sent: 'desc',
      },
      where: {
        ...(isAdmin
          ? null
          : {
              client_message: {
                OR: [
                  {
                    seller_id: userId,
                  },
                  {
                    bdc_id: userId,
                  },
                ],
              },
            }),
      },
    });

    //await prisma.$disconnect();

    const messages: AllSms = [];
    let lastId: number = 0;

    data.forEach((messageData) => {
      const customerMessageExists = messages.find(
        (customerMessage) => customerMessage.client_id === messageData.client_id,
      );

      const unregisteredCustomerMessageExists = messages.find((unreCustomerMssg) => {
        if (
          unreCustomerMssg.unregistered_customer.every((mssData) =>
            messageData.unregistered_customer.some((smsData) => smsData.id === mssData.id),
          ) &&
          customerMessageExists
        ) {
          return unreCustomerMssg;
        }
      });

      if (!customerMessageExists && !messageData.unregistered_customer) {
        messages.push({
          client_id: messageData.client_id,
          client_message: messageData.client_message,
          date_sent: messageData.date_sent,
          id: messageData.id,
          message: messageData.message,
          sent_by_user: messageData.sent_by_user,
          status_id: messageData.status_id,
          user: messageData.user,
          unregistered_customer: messageData.unregistered_customer,
          total_no_read_messages: messageData.status_id === 2 ? 1 : 0,
          read_by: messageData.read_by,
          sent: messageData.sent,
          delivered: messageData.delivered,
          fileAttachment: messageData.fileAttachment,
          message_sid: messageData.message_sid,
        });

        lastId = messageData.id;
      } else if (!unregisteredCustomerMessageExists) {
        messages.push({
          client_id: messageData.client_id,
          client_message: messageData.client_message,
          date_sent: messageData.date_sent,
          id: messageData.id,
          message: messageData.message,
          sent_by_user: messageData.sent_by_user,
          status_id: messageData.status_id,
          user: messageData.user,
          unregistered_customer: messageData.unregistered_customer,
          total_no_read_messages: messageData.status_id === 2 ? 1 : 0,
          read_by: messageData.read_by,
          sent: messageData.sent,
          delivered: messageData.delivered,
          fileAttachment: messageData.fileAttachment,
          message_sid: messageData.message_sid,
        });

        lastId = messageData.id;
      } else {
        const unreadMessages =
          messageData.id !== lastId && messageData.status_id === 2 ? true : false;

        if (unreadMessages && customerMessageExists) {
          customerMessageExists.total_no_read_messages += 1;
        } else if (unreadMessages && unregisteredCustomerMessageExists) {
          unregisteredCustomerMessageExists.total_no_read_messages += 1;
        }

        lastId = messageData.id;
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
