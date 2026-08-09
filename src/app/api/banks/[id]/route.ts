import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const leadSourceId = parseInt(params.id);

  try {
    const data = await prisma.banks.delete({
      where: {
        id: leadSourceId,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Lead SuccessFully Deleted' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
