import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// deberia ser por business id,  (multi-tenant)
export async function GET() {
  try {
    const data = await prisma.client_Bulk_sms.findMany({
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
    //await prisma.$disconnect();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
