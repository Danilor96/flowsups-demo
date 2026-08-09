import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const [customer, user] = params.id.split('_');

  const customerId = parseInt(customer);
  const userId = parseInt(user);

  try {
    const data = await prisma.client_sms.updateMany({
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
      data: {
        status_id: 1,
        read_by: {
          push: userId,
        },
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Message Status Successfully Changed' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
