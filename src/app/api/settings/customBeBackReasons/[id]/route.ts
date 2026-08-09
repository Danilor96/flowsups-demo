import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const reasonId = parseInt(params.id);

  try {
    const data = await prisma.custom_be_back_reasons.delete({
      where: {
        id: reasonId,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Reason Successfully Deleted' }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
