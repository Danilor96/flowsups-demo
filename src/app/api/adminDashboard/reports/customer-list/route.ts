import { mockDb } from '@/app/libs/mock-db';
import { ListViewTypes, SortConfig } from '@/store/customerList/types';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { reportAllCustomer } from './reportAllCustomer';

export async function POST(req: NextRequest) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const owner_user_id = user.id;

  try {
    const body = await req.json();
    const filters = body.filters as AppliedFilter[];
    const advancedFilters = body.advancedFilters as AppliedFilter[];
    const sortConfig = body.sortConfig as SortConfig;
    const viewType = body.viewType as ListViewTypes;
    const columnsConfig = body.columnsConfig as { id: string; label: string; checked: boolean }[];
    const forCompany = body.forCompany as boolean;
    const allowedUserIds = body.allowedUserIds as number[] | undefined;

    const { name } = body;
    const nameTrimmed = name.trim();
    const existingReport = mockDb.customer_Report.findFirst({
      where: {
        name: {
          equals: nameTrimmed,
        },
      },
    });

    if (existingReport) {
      return NextResponse.json({ fieldErrors: { name: 'Report name already exists' } }, { status: 400 });
    }

    const data = mockDb.customer_Report.create({
      data: {
        owner_user_id,
        name: nameTrimmed,
        filters: JSON.stringify(filters),
        advanced_filters: JSON.stringify(advancedFilters),
        sort_config: JSON.stringify(sortConfig),
        columns_config: columnsConfig as Record<string, any>[],
        view_type: viewType === ListViewTypes.ListView ? 'ListView' : 'DetailView',
        for_company: forCompany,
        permissions: allowedUserIds ? allowedUserIds.map((userId) => ({ userId })) : [],
      },
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json({ successMessage: 'Report created successfully', data });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = mockDb.customer_Report.findMany({
      where: {
        OR: [{ owner_user_id: user.id }, { permissions: { some: { userId: user.id } } }],
      },
    });
    const dataWhitReportAllCustomers = [{ ...reportAllCustomer, owner_user_id: user.id }].concat(data as any);
    return NextResponse.json({ data: dataWhitReportAllCustomers });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
