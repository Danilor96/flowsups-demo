import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request, { params }: { params: { phoneNumber: string } }) {
  const customerPhoneNumber = params.phoneNumber;

  try {
    const data = await prisma.clients.findFirst({
      where: {
        OR: [
          {
            mobile_phone: customerPhoneNumber,
          },
          {
            home_phone: customerPhoneNumber,
          },
        ],
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        mobile_phone: true,
        seller: {
          select: {
            id: true,
            name: true,
            last_name: true,
            mobile_phone: true,
          },
        },
        bdc: {
          select: {
            id: true,
            name: true,
            last_name: true,
            mobile_phone: true,
          },
        },
      },
    });

    //await prisma.$disconnect();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverErrora: 'Server Error' }, { status: 500 });
  }
}
