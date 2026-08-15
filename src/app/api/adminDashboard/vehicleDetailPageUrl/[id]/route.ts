import { checkPermissions } from '@/app/libs/auth-helpers';
import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(46);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const vehicleUrlId = parseInt(params.id);

  try {
    const data = mockDb.business_vehicle_detail_page_url.delete({
      where: {
        id: vehicleUrlId,
      },
    });

    return NextResponse.json({ successMessage: 'Url Successfully Deleted' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
