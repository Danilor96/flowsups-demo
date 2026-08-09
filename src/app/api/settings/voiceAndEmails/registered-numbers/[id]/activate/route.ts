import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prisma';

// (deberia ser multi tenant)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const phoneId = parseInt(params.id);

  try {
    const businesPhoneNumber = await prisma.business_phone_numbers.update({
      where: {
        id: phoneId,
      },
      data: {
        is_publishing_number: true,
      },
    });

    if (!businesPhoneNumber || !businesPhoneNumber.business_id) {
      return NextResponse.json({ serverError: 'Phone number not found' }, { status: 404 });
    }

    const currentPhoneActive = await prisma.business_phone_numbers.findFirst({
      where: {
        business_id: businesPhoneNumber.business_id,
        is_publishing_number: true,
      },
    });

    if (currentPhoneActive) {
      await prisma.business_phone_numbers.update({
        where: {
          id: currentPhoneActive.id,
        },
        data: {
          is_publishing_number: false,
        },
      });
    }

    await prisma.business_phone_numbers.update({
      where: {
        id: phoneId,
      },
      data: {
        is_publishing_number: true,
      },
    });

    return NextResponse.json({ successMessage: 'Phone number activated successfully' }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
