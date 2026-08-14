import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const [customer, user] = params.id.split('_');

  const customerId = parseInt(customer);
  const userId = parseInt(user);

  try {
    const matches = mockDb.client_sms.findMany({
      where: {
        OR: [
          {
            OR: [
              { client_id: customerId },
              {
                unregistered_customer: {
                  some: {
                    id: customerId,
                  },
                },
              },
            ],
            AND: {
              OR: [
                { status_id: 2 },
                {
                  AND: [
                    { OR: [{ status_id: 2 }, { status_id: 1 }] },
                    {
                      NOT: {
                        read_by: {
                          has: userId,
                        },
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    });

    matches.forEach((sms) => {
      mockDb.client_sms.update({
        where: {
          id: sms.id,
        },
        data: {
          status_id: 1,
          read_by: Array.from(new Set([...(sms.read_by || []), userId])),
        },
      });
    });

    return NextResponse.json({ successMessage: 'Message Status Successfully Changed' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
