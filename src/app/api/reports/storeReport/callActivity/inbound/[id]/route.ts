import prisma from '@/app/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { CallDirection, extractIds, InboundCallDetail } from '../types';
import { buildDatePrismaFilter } from '@/app/libs/buildDatePrismaFilter';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id);

  const { searchParams } = request.nextUrl;
  const option = searchParams.get('optionDate');
  const value = searchParams.get('valueDate');
  const from = searchParams.get('fromDate');
  const to = searchParams.get('toDate');

  const dateFilterObject = option ? { option, value, from, to } : null;

  try {
    const dateWhereClause = buildDatePrismaFilter(dateFilterObject);

    const data = await prisma.client_calls.findMany({
      where: {
        call_date: dateWhereClause,
        call_direction_id: CallDirection.inbound,
        user_id: {
          has: userId,
        },
      },
      select: {
        client_call: {
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
        inboundCall: true,
        call_date: true,
        note: {
          select: {
            created_at: true,
            created_by: {
              select: {
                name: true,
                last_name: true,
              },
            },
            note: true,
          },
        },
        followUpDate: true,
      },
    });

    //await prisma.$disconnect();

    const dataToReturn: InboundCallDetail[] = data.map((call) => {
      const firstname = call.client_call?.first_name || '';
      const lastname = call.client_call?.last_name || '';
      const customerName = `${firstname} ${lastname}`;
      const customerId = call.client_call?.id || -1;
      const customerStatus = call.client_call?.client_status?.status || '';

      const callMadeAt = call.call_date;
      const followUp = call.followUpDate;
      const inbound = call.inboundCall;

      const notes = call?.note ? [call?.note] : [];

      return {
        customerName,
        customerId,
        notes,
        customerStatus,
        callMadeAt,
        followUp,
        inbound,
      };
    });

    return NextResponse.json(dataToReturn);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
