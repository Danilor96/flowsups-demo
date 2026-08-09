import { checkPermissions } from '@/app/libs/auth-helpers';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(46);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const vehicleUrlId = parseInt(params.id);

  try {
    const data = await prisma.business_vehicle_detail_page_url.delete({
      where: {
        id: vehicleUrlId,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Url Successfully Deleted' });
  } catch (error) {
    console.log(error);

    //await prisma?.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
