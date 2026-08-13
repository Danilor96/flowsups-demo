import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const roleId = parseInt(params.id);

  try {
    const data = mockDb.roles_has_permissions.findUnique({
      where: {
        role_id: roleId,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}