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

  try {
    const userDb = await prisma.users.findUnique({
      where: {
        id: user.id,
        deleted_at: null,
      },
      select: {
        id: true,
        default_customer_report_id: true,
      },
    });

    let dataConnect: number | null = customerReportId;

    if (userDb?.default_customer_report_id === customerReportId) {
      dataConnect = null;
    }

    const result = await prisma.users.update({
      where: {
        id: user.id,
        deleted_at: null,
      },
      data: {
        default_customer_report_id: dataConnect,
      },
      select: {
        id: true,
        name: true,
        default_customer_report_id: true,
      },
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);
    return NextResponse.json({
      successMessage: dataConnect === null ? 'Default Report Removed' : 'Default Report Set',
      data: result,
    });
  } catch (error: any) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
