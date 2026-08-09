import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prisma';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const dealId = parseInt(params.id);

  try {
    const data = await prisma.deal.findUnique({
      where: {
        id: dealId,
      },
      include: {
        paymentDate: {
          include: {
            amountPerDate: true,
          },
        },
        lead: {
          include: {
            vehicle: true,
          },
        },
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ deal: data });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
