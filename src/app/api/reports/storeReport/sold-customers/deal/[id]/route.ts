import { NextResponse } from 'next/server';
import { mockDb } from '@/app/libs/mock-db';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const dealId = parseInt(params.id);

  try {
    const data = mockDb.deal.findUnique({
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

    return NextResponse.json({ deal: data });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
