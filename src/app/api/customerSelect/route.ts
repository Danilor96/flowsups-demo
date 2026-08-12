import { NextResponse } from 'next/server';
import { mockDb } from '@/app/libs/mock-db';
import { CustomersForInfiniteScroll } from './types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('q') || '';
  const cursor = searchParams.get('cursor');
  const limit = 10;

  try {
    const customers = mockDb.clients.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: Number(cursor) } : undefined,
      orderBy: { first_name: 'asc' },
      where: {
        OR: [
          {
            first_name: { contains: searchTerm, mode: 'insensitive' },
          },
          {
            last_name: { contains: searchTerm, mode: 'insensitive' },
          },
          {
            mobile_phone: { contains: searchTerm, mode: 'insensitive' },
          },
          {
            email: { contains: searchTerm, mode: 'insensitive' },
          },
        ],
      },
    });

    const nextCursor = customers.length === limit ? customers[customers.length - 1].id : null;

    const dataToReturn: CustomersForInfiniteScroll[] = customers.map((customer) => ({
      id: customer.id,
      customerName: `${customer.first_name}${customer.last_name ? ` ${customer.last_name}` : ''}`,
      mobilePhone: customer.mobile_phone || '',
      status: customer.lead[0]?.customer_status?.status || '',
    }));

    return NextResponse.json({ customers: dataToReturn, nextCursor });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
