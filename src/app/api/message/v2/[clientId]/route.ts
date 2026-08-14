import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { clientId: string } }) {
  const clientId = parseInt(params.clientId);
  if (!clientId || isNaN(clientId)) {
    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }

  try {
    const data = mockDb.client_sms.findMany({
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
      orderBy: {
        date_sent: 'asc'
      }
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
