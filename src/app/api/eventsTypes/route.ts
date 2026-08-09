import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await prisma.events_types.findMany({
      select: {
        id: true,
        type: true,
        category_id: true,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
