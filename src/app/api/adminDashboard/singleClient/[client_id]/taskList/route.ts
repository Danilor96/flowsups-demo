import prisma from '@/app/libs/prisma';
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { client_id: string; } }) {
  const client_id = parseInt(params.client_id);

  try {
    const data = await prisma.tasks.findMany({
      where: {
        customer_id: client_id,
        is_funding_task: true,
      },
      include: {
        assigned: true,
        notes: true
      }
    })

    //await prisma.$disconnect();

    return NextResponse.json({ data });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
