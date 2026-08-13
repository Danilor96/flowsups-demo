import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request, { params }: { params: { phoneNumber: string } }) {
  const customerPhoneNumber = params.phoneNumber;

  try {
    const data = mockDb.clients.findFirst({
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
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverErrora: 'Server Error' }, { status: 500 });
  }
}