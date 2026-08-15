import { mockDb } from '@/app/libs/mock-db';
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
    const userDb = mockDb.users.findUnique({
      where: {
        id: user.id,
        deleted_at: null,
      },
    });

    let dataConnect: number | null = customerReportId;

    if (userDb?.default_customer_report_id === customerReportId) {
      dataConnect = null;
    }

    const result = mockDb.users.update({
      where: {
        id: user.id,
        deleted_at: null,
      },
      data: {
        default_customer_report_id: dataConnect,
      },
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);
    return NextResponse.json({
      successMessage: dataConnect === null ? 'Default Report Removed' : 'Default Report Set',
      data: result,
    });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
