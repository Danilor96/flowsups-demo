import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// deberia ser por business id,  (multi-tenant)
export async function GET() {
  try {
    const data = mockDb.client_Bulk_sms.findMany({
      include: {
        bulk_sms_creator: {
            select: {
                id: true,
                name: true,
                last_name: true,
            }
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
