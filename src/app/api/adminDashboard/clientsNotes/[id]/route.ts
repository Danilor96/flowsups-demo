import prisma from '@/app/libs/prisma';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const customerStatusId = parseInt(params.id);

  try {
    const data = await prisma?.notes.findMany({
      where: {
        client_note: {
          client_status_id: customerStatusId,
        },
      },
      select: {
        id: true,
        note: true,
        created_at: true,
        created_by: {
          select: {
            name: true,
            last_name: true,
            id: true,
            email: true,
          },
        },
        from: {
          select: {
            id: true,
            from: true,
          },
        },
        client_id: true,
      },
      orderBy: {
        created_at: 'desc',
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
