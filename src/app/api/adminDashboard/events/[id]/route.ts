import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const clientId = params.id;

  try {
    const data = mockDb.events.findMany({
      where: {
        client_id: parseInt(clientId),
      },
      orderBy: {
        updated_at: 'desc',
      },
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}