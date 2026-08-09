import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const roleId = parseInt(params.id);

  try {
    const data = await prisma.roles_has_permissions.findUnique({
      where: {
        role_id: roleId,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
