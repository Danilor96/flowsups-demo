import { z } from 'zod';
import { NextResponse } from 'next/server';
import { FundingStatuses } from '@/app/libs/customer/customersFunctions';
import { auth } from '@/auth';
import { mockDb } from '@/app/libs/mock-db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  const formData = await request.formData();

  const session = await auth();

  const userId = session?.user.id;

  const fundedListSchema = z
    .object({
      statusId: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      note: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    })
    .superRefine((data, ctx) => {
      if (data.statusId === '3' && !data.note) {
        ctx.addIssue({
          path: ['note'],
          message: 'Please enter a note',
          code: 'custom',
        });
      }
    });

  const validatedData = fundedListSchema.safeParse({
    statusId: formData.get('statusId'),
    note: formData.get('note'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { statusId, note } = validatedData.data;

  const isFundingReturned = parseInt(statusId) === FundingStatuses.Returned;
  const isFundingFunded = parseInt(statusId) === FundingStatuses.Funded;
  try {
    mockDb.clients.update({
      where: {
        id: customerId,
      },
      data: {
        funding_list_status_id: parseInt(statusId),
        client_funding_returned_at: isFundingReturned ? new Date().toISOString() : null,
      },
    });

    const activeLead = mockDb.leads.findFirst({
      where: {
        customer_id: customerId,
        is_active: true,
      },
    });

    if (activeLead && activeLead.id) {
      mockDb.leads.update({
        where: {
          id: activeLead.id,
        },
        data: {
          customer_funding_list_status_id: parseInt(statusId),
          customer_funding_returned_at: isFundingReturned ? new Date().toISOString() : null,
          funding_created_at: isFundingFunded ? new Date().toISOString() : null,
        },
      });
    }

    if (statusId === '3' && note) {
      mockDb.notes.create({
        data: {
          note: note,
          created_at: new Date().toISOString(),
          client_id: customerId,
          created_by_id: userId,
          from_id: 7,
        },
      });
    }

    return NextResponse.json({ successMessage: 'Status Successfully Changed' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}