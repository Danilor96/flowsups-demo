import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function GET() {
  const permissionsCheck = await checkPermissions(43);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  try {
    const data = await prisma.system_accesses.findMany({
      include: {
        user: {
          select: {
            name: true,
            last_name: true,
            username: true,
          },
        },
      },
    });

    //await prisma.$disconnect();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
