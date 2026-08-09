import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { callSid: string } }) {
  const callSid = params.callSid;

  const formData = await request.formData();

  const customerId = formData.get('customerId')?.toString();
  const userId = formData.get('userId')?.toString();
  const callDirection = formData.get('callDirection')?.toString();
  const phoneNumber = formData.get('phoneNumber')?.toString();

  try {
    const callRegistered = await prisma.client_calls.findUnique({
      where: {
        call_sid: callSid,
      },
      select: {
        id: true,
      },
    });

    if (userId && callDirection && callRegistered === null) {
      const data = await prisma.client_calls.create({
        data: {
          call_date: new Date(),
          call_sid: callSid,
          call_duration: '0',
          call_direction_id: parseInt(callDirection),
          call_status_id: 6,
          client_id: customerId ? parseInt(customerId) : null,
          phone_number: phoneNumber ? phoneNumber.slice(-10) : null,
          user_id: [parseInt(userId)],
        },
      });

      if (customerId) {
        // create a new lead register
        await prisma.client_has_lead.create({
          data: {
            created_at: new Date(),
            assigned_to_id: parseInt(userId),
            client_id: parseInt(customerId),
            status_id: 2,
            created_by_id: parseInt(userId),
            lead_id: 3,
          },
        });
      }
    } else {
      //await prisma.$disconnect();

      return NextResponse.json(
        { fieldErrors: 'Customer ID or User ID not found' },
        { status: 422 },
      );
    }

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Data Successfully Saved' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
