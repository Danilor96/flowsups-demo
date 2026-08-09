import prisma from '@/app/libs/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const customerReportId = parseInt(params.id);
  if (isNaN(customerReportId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  if (body.isAsFavorite === undefined) {
    return NextResponse.json({ error: 'Missing isAsFavorite field' }, { status: 400 });
  }
  console.log('body: ', body.isAsFavorite);
  const isAsFavorite = body.isAsFavorite;
  console.log('isAsFavorite: ', isAsFavorite);
  try {
    let dataConnect = null;
    if (isAsFavorite) {
      dataConnect = await prisma.users.update({
        where: {
          id: user.id,
          deleted_at: null,
        },
        data: {
          favorite_customer_reports: {
            connect: {
              id: customerReportId,
            },
          },
        },
        select: {
          id: true,
          name: true,
        },
      });
    }

    if (!isAsFavorite) {
      dataConnect = await prisma.users.update({
        where: {
          id: user.id,
          deleted_at: null,
        },
        data: {
          favorite_customer_reports: {
            disconnect: {
              id: customerReportId,
            },
          },
        },
        select: {
          id: true,
          name: true,
        },
      });
    }

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);
    return NextResponse.json({
      successMessage: `Report ${isAsFavorite ? 'Added to' : 'Removed from'} your favorites`,
      data: dataConnect,
    });
  } catch (error: any) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
