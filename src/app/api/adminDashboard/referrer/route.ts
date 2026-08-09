import prisma from '@/app/libs/prisma';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: Request) {
  const formData = await request.formData();

  const session = await auth();

  const userId = session?.user.id;

  const referrerSchema = z.object({
    referrerId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    buyerReferred: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedFields = referrerSchema.safeParse({
    referrerId: formData.get('clientReferrerId'),
    buyerReferred: formData.get('clientBuyerReferred'),
  });

  if (!validatedFields.success) {
    return NextResponse.json(
      { fieldErrors: validatedFields.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { buyerReferred, referrerId } = validatedFields.data;

  try {
    if (!userId) throw new Error('No User Founded');

    const data = await prisma.clients_has_referrer.upsert({
      where: {
        client_buyer_id: parseInt(buyerReferred),
      },
      update: {
        client_referrer_id: parseInt(referrerId),
        created_by: userId,
      },
      create: {
        client_buyer_id: parseInt(buyerReferred),
        client_referrer_id: parseInt(referrerId),
        created_by: userId,
      },
      select: {
        id: true,
        referrer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            mobile_phone: true,
            email: true,
            current_address: true,
            home_phone: true,
            work_phone: true,
          },
        },
      },
    });

    const activeLead = await prisma.leads.findFirst({
      where: {
        customer_id: parseInt(buyerReferred),
        is_selected: true,
      },
      select: {
        id: true,
      },
    });

    if (activeLead && activeLead.id) {
      const lead = await prisma.leads.update({
        where: {
          id: activeLead.id,
          customer_id: parseInt(buyerReferred),
          is_selected: true,
        },
        data: {
          customer_referrer_id: data.id,
        },
      });
    }

    //await prisma?.$disconnect();

    return NextResponse.json({ successMessage: 'Referrer Registered' });
  } catch (error: any) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
