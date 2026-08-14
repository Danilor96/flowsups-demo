import { mockDb } from '@/app/libs/mock-db';
import { NextRequest, NextResponse } from 'next/server';
import { SmsDetail } from '../types';
import { buildDatePrismaFilter } from '@/app/libs/buildDatePrismaFilter';


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id);

  const { searchParams } = request.nextUrl;
  const smsStatus = searchParams.get('smsStatus') as 'sent' | 'delivered' | 'failed' | 'clientReplied' | null; 
  const option = searchParams.get('optionDate');
  const value = searchParams.get('valueDate');
  const from = searchParams.get('fromDate');
  const to = searchParams.get('toDate');
  const dateFilterObject = option ? { option, value, from, to } : null;

  const auto = searchParams.get('auto');

  try {
    const dateWhereClause = buildDatePrismaFilter(dateFilterObject);
    const smsStatusWhereClause = smsStatus && smsStatus !== 'clientReplied' ? { [smsStatus]: true } : {};
    const clientRepliedWhere = smsStatus === 'clientReplied' ? { has_customer_reply: true } : {};

    const data = mockDb.client_sms.findMany({
      where: {
        sent_by_user: true,
        date_sent: dateWhereClause,
        ...smsStatusWhereClause,
        ...clientRepliedWhere,
        user: {
          some: {
            id: userId,
          },
        },
        manual_sent: !auto,
      },
      select: {
        client_message: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            client_status: {
              select: {
                status: true,
              },
            },
          },
        },
        message: true,
        date_sent: true,
        fileAttachment: true,
        client_phone_number: true,
        user: {
          select: {
            name: true,
            last_name: true,
          },
        },
        sent_by_user: true,
        sent: true,
        delivered: true,
        failed: true,
      },
    });

    const smsMap = new Map<number, SmsDetail>();

    if (data && data.length > 0) {
      data.forEach((smsData) => {
        const customerId = smsData.client_message?.id;

        const userFirstName = smsData?.user[0]?.name || '';
        const userLastName = smsData?.user[0]?.last_name || '';
        const user = `${userFirstName} ${userLastName}`;

        if (customerId) {
          const firstName = smsData.client_message?.first_name || '';
          const lastName = smsData.client_message?.last_name || '';
          const customerName = `${firstName}${lastName ? ` ${lastName}` : ''}`;
          const customerStatus = smsData.client_message?.client_status?.status || '';

          if (!smsMap.has(customerId)) {
            smsMap.set(customerId, {
              customerName,
              customerId,
              smsData: [],
              customerStatus,
            });
          }

          const sms = smsMap.get(customerId)!;

          sms.smsData.push({
            message: smsData.message,
            fileAttachment: smsData.fileAttachment,
            dateSent: smsData.date_sent,
            clientPhoneNumber: smsData.client_phone_number,
            user,
            delivered: smsData.delivered,
            sent: smsData.sent,
            sentByUser: smsData.sent_by_user,
            customer: customerName,
            failed: smsData.failed,
          });
        } else {
          const phoneNumber = parseInt(smsData.client_phone_number);

          if (!smsMap.has(phoneNumber)) {
            smsMap.set(phoneNumber, {
              customerName: 'Unregistered Customers',
              smsData: [],
              customerStatus: '',
            });
          }

          const sms = smsMap.get(phoneNumber)!;

          sms.smsData.push({
            message: smsData.message,
            fileAttachment: smsData.fileAttachment,
            dateSent: smsData.date_sent,
            clientPhoneNumber: smsData.client_phone_number,
            user,
            delivered: smsData.delivered,
            sent: smsData.sent,
            sentByUser: smsData.sent_by_user,
            customer: 'Unregistered',
            failed: smsData.failed,
          });
        }
      });
    }

    const dataToReturn: SmsDetail[] = Array.from(smsMap.values()).map((el) => ({
      customerName: el.customerName,
      customerId: el.customerId,
      smsData: el.smsData,
      customerStatus: el.customerStatus,
    }));

    return NextResponse.json(dataToReturn);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
