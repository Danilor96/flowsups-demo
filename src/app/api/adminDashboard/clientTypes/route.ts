import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';

// get all client types logic

export async function GET() {
  try {
    const data = await mockDb.client_types.findMany();

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
