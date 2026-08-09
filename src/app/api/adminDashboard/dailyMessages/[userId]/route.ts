import { DailyMessagesData } from '@/app/libs/definitions';
import prisma from '@/app/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { Roles } from '../../dailyCalls/types';
import { getEndOfDay, getStartOfDay } from '@/app/libs/buildDatePrismaFilter';

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const userId = parseInt(params.userId);

  const session = await auth();

  const roleId = session?.user.user_has[0].role_id;

  const hasPermissionToGetAll = roleId === Roles.Administrator || roleId === Roles.Superuser;

  const { searchParams } = request.nextUrl;
  const timeZone = searchParams.get('timezone') || 'America/Chicago';
  const now = new Date();
  const startOfTodayUTC = getStartOfDay(now, timeZone);
  const endOfTodayUTC = getEndOfDay(now, timeZone);

  try {
    const data = await prisma.client_sms.findMany({
      where: {
        date_sent: {
          gte: startOfTodayUTC,
          lte: endOfTodayUTC,
        },
        is_consent_message: false,
        sent_by_user: true,
        user: hasPermissionToGetAll
          ? undefined
          : {
              every: {
                id: userId,
              },
            },
      },
      include: {
        client_message: {
          select: {
            first_name: true,
            last_name: true,
            lead_temperature_id: true,
            id: true,
            email: true,
            mobile_phone: true,
            client_status: {
              select: {
                status: true,
              },
            },
            seller: {
              select: {
                id: true,
                name: true,
                last_name: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            last_name: true,
            id: true,
          },
        },
        sender_user: {
          select: {
            name: true,
            last_name: true,
            id: true,
          },
        },
        status: {
          select: {
            status: true,
          },
        },
        unregistered_customer: {
          select: {
            id: true,
            mobile_phone_number: true,
            user: {
              select: {
                name: true,
                last_name: true,
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        date_sent: 'desc',
      },
    });

    //await prisma.$disconnect();

    let newCustomerMessages: DailyMessagesData = [];

    const lastMessage = data.map((messageData) => {
      const customerMessageExists = newCustomerMessages.find(
        (customerMessage) => customerMessage.client_id === messageData.client_id,
      );

      if (!customerMessageExists) {
        newCustomerMessages.push(messageData);
      }
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(newCustomerMessages);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
