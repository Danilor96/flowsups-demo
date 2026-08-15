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
  const body = await request.json();
  if (body.isAsFavorite === undefined) {
    return NextResponse.json({ error: 'Missing isAsFavorite field' }, { status: 400 });
  }
  console.log('body: ', body.isAsFavorite);
  const isAsFavorite = body.isAsFavorite;
  console.log('isAsFavorite: ', isAsFavorite);
  try {
    const userDb = mockDb.users.findUnique({
      where: {
        id: user.id,
        deleted_at: null,
      },
    });

    const currentFavorites = Array.isArray(userDb?.favorite_customer_reports)
      ? userDb.favorite_customer_reports
      : [];

    const updatedFavorites = isAsFavorite
      ? currentFavorites.some((report: any) => report.id === customerReportId)
        ? currentFavorites
        : [...currentFavorites, { id: customerReportId }]
      : currentFavorites.filter((report: any) => report.id !== customerReportId);

    const dataConnect = mockDb.users.update({
      where: {
        id: user.id,
        deleted_at: null,
      },
      data: {
        favorite_customer_reports: updatedFavorites,
      },
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);
    return NextResponse.json({
      successMessage: `Report ${isAsFavorite ? 'Added to' : 'Removed from'} your favorites`,
      data: dataConnect,
    });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
