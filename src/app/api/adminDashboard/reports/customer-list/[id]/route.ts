import { mockDb } from '@/app/libs/mock-db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = mockDb.customer_Report.delete({
      where: {
        id: Number(id),
        owner_user_id: user.id,
      },
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json({ successMessage: 'Report Successfully Deleted', data });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const userIds = body?.userIds as number[];
  if (userIds === undefined) {
    return NextResponse.json({ error: 'error' }, { status: 400 });
  }

  try {
    const permissions = userIds.map((userId) => ({ userId }));

    const data = mockDb.customer_Report.update({
      where: {
        id,
      },
      data: {
        permissions,
      },
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json({ successMessage: 'Report permissions updated' });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
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
    const data = mockDb.customer_Report.findUnique({
      where: {
        id: customerReportId,
      },
    });

    return NextResponse.json({ data: data });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}