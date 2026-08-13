import { checkPermissions } from '@/app/libs/auth-helpers';
import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(56);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const checkElId = parseInt(params.id);

  try {
    mockDb.consent_checks.delete({
      where: {
        id: checkElId,
      },
    });

    return NextResponse.json({ successMessage: 'Term/Condition Successfully Deleted' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
