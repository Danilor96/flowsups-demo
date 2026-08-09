import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prisma';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const clientId = params.id;

  try {
    const data = await prisma?.events.findMany({
      where: {
        client_id: parseInt(clientId),
      },
      include: {
        event_creator: {
          select: {
            name: true,
            last_name: true,
            id: true,
          },
        },
      },
      orderBy: {
        updated_at: 'desc',
      },
    });

    //await prisma?.$disconnect();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
