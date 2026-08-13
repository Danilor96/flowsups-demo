import { mockDb } from '@/app/libs/mock-db';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createEvent } from '@/app/libs/events/events';
import { auth } from '@/auth';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions(60);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const session = await auth();

  const userId = session?.user.id;

  const reassignLeadsSchema = z
    .object({
      customersArray: z
        .array(z.number({ invalid_type_error: 'Please enter a valid value' }))
        .min(1, 'Please select a customer'),
      salesReps: z.array(
        z
          .number({ invalid_type_error: 'Please enter a valid value' })
          .min(1, 'Please enter a sales rep'),
      ),
    })
    .refine((data) => data.customersArray.length > 0, {
      message: 'Please select a customer',
      path: ['salesReps'],
    });

  const arrayData = formData.get('customers');
  const salesRepsArray = formData.get('salesReps');

  const validatedData = reassignLeadsSchema.safeParse({
    customersArray: typeof arrayData === 'string' && JSON.parse(arrayData),
    salesReps: typeof salesRepsArray === 'string' && JSON.parse(salesRepsArray),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { customersArray, salesReps } = validatedData.data;

  try {
    let salesRepIds: number[] = [...salesReps];

    let randomSalesId: number | null = null;

    for (let i = 0; i < customersArray.length; i++) {
      const customerId = customersArray[i];

      const prevClient = mockDb.clients.findUnique({
        where: {
          id: customerId,
        },
      });

      const prevSalesRep = prevClient ? { seller: prevClient.seller } : null;

      if (salesRepIds.length === 0) salesRepIds = [...salesReps].sort(() => Math.random() - 0.5);

      randomSalesId = getRandomNumber(salesRepIds);

      salesRepIds = salesRepIds.filter((el) => el !== randomSalesId);

      mockDb.clients.update({
        where: {
          id: customerId,
        },
        data: {
          seller_id: randomSalesId,
        },
      });

      const data = {
        seller: mockDb.users.findUnique({
          where: {
            id: randomSalesId,
          },
        }),
      };

      const prevSalesRepName = `${prevSalesRep?.seller?.name || ''} ${
        prevSalesRep?.seller?.last_name || ''
      }${prevSalesRep?.seller?.username ? ` - ${prevSalesRep.seller.username}` : ''}`;

      const newSalesRep = `${data.seller?.name || ''} ${data.seller?.last_name || ''}${
        data.seller?.username ? ` - ${data.seller.username}` : ''
      }`;

      const description = `Sales Rep changed from bulk actions. \n Prev sales rep: ${prevSalesRepName}. \n New sales rep: ${newSalesRep}.`;

      if (userId) await createEvent(description, userId, customerId, new Date());
    }

    return NextResponse.json({ successMessage: 'Customers Successfully Reassigned' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

function getRandomNumber(arr: number[]) {
  if (arr.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * arr.length);

  return arr[randomIndex];
}