import { NextResponse } from 'next/server';
import { mockDb } from '@/app/libs/mock-db';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(48);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const recipientId = parseInt(params.id);

  try {
    const data = mockDb.sms_limit_warning_recipients.delete({
      where: {
        id: recipientId,
      },
    });

    return NextResponse.json({ successMessage: 'Recipient Deleted Successfully' }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
