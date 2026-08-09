import prisma from '@/app/libs/prisma';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';



export async function PUT(request: Request, { params }: { params: { } }) {
  const session = await auth();
  const userSession = session?.user;

  const formData = await request.formData();

  const Schema = z
    .object({
      clientId: z.string({ invalid_type_error: 'Please enter a valid value' }).nullish(),
      unregisteredCustomerId: z.string({ invalid_type_error: 'Please enter a valid value' }).nullish(),
      note: z.string({ invalid_type_error: 'invalid_type_error' }).min(1, 'Required'),
    })


  const validatedData = Schema.safeParse({
    clientId: formData.get('clientId'),
    unregisteredCustomerId: formData.get('unregisteredCustomerId'),
    note: formData.get('note'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { clientId, unregisteredCustomerId, note } = validatedData.data;

  // proximamente se debe agregar por el bussines id (multi tenant)
  try {
    if (clientId) {
      await prisma.conversation.update({
        where: {
          client_id: parseInt(clientId)
        },
        data: {
          pending_reply_count: 0
        }
      });

      const noteData = await prisma.notes.create({
        data: {
          note: note,
          created_at: new Date().toISOString(),
          created_by_id: userSession?.id as number,
          client_id: parseInt(clientId),
        },
        select: {
          id: true,
        },
      });
      await prisma.client_has_lead.create({
        data: {
          client_id: parseInt(clientId),
          created_by_id: userSession?.id as number,
          assigned_to_id: userSession?.id,
          status_id: 2, // completed
          created_at: new Date().toISOString(),
          lead_id: 21, // Removed Notification
          note_id: noteData.id,
        }
      })
    }

    if (unregisteredCustomerId) {
      await prisma.conversation.update({
        where: {
          unregistered_customer_id: parseInt(unregisteredCustomerId)
        },
        data: {
          pending_reply_count: 0
        }
      });
    }

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Sending Message' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
