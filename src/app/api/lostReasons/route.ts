import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const reasons = await prisma.lost_reasons.findMany();

    return NextResponse.json(reasons);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
