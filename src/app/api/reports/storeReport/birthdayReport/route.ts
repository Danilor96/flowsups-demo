import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await prisma.clients.findMany({
      select: {
        id: true,
        born_date: true,
        first_name: true,
        last_name: true,
        social_security: true,
        client_address: {
          select: {
            city: true,
          },
        },
        last_activity: true,
        client_status: {
          select: {
            status: true,
          },
        },
        home_phone: true,
        work_phone: true,
        mobile_phone: true,
        created_at: true,
        contact_time: true,
        email: true,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
