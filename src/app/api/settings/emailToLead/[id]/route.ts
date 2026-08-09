import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prisma';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(54);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const forwardIncomingId = parseInt(params.id);

  try {
    const data = await prisma.email_to_lead.delete({
      where: {
        id: forwardIncomingId,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Deleted Successfully' }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
