import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = mockDb.cobuyer_client_relationship.findMany();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const clientData = await request.json();

  const urlRequest = new URL(request.url);

  const searchParams = urlRequest.searchParams;

  const currentLeadId = searchParams.get('leadId');

  const cobuyerSchema = z.object({
    buyerClientId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please select a client'),
    cobuyerClientId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please select a cobuyer'),
    relationshipId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please select a relationship'),
  });

  const validatedData = cobuyerSchema.safeParse({
    buyerClientId: clientData.assigClient,
    cobuyerClientId: clientData.cobuyerid,
    relationshipId: clientData.relationship,
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldsErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { buyerClientId, cobuyerClientId, relationshipId } = validatedData.data;

  try {
    let leadWhereId: number | null = null;
    let cobuyerRelationId: number | null = null;

    if (currentLeadId) {
      const currentLead = mockDb.leads.findUnique({
        where: {
          id: Number(currentLeadId),
        },
      });

      leadWhereId = Number(currentLeadId);

      if (currentLead?.customer_cobuyer_id) {
        cobuyerRelationId = currentLead.customer_cobuyer_id;
      }
    } else {
      const activeLead = mockDb.leads.findFirst({
        where: {
          customer_id: parseInt(buyerClientId),
          is_selected: true,
          is_active: true,
        },
      });

      leadWhereId = activeLead?.id ?? null;

      if (activeLead?.customer_cobuyer_id) {
        cobuyerRelationId = activeLead.customer_cobuyer_id;
      }
    }

    if (leadWhereId) {
      const existingCobuyer = cobuyerRelationId
        ? mockDb.client_has_cobuyer.findUnique({
            where: {
              id: cobuyerRelationId,
            },
          })
        : null;

      const data = existingCobuyer
        ? mockDb.client_has_cobuyer.update({
            where: {
              id: cobuyerRelationId!,
            },
            data: {
              buyer_client_id: parseInt(buyerClientId),
              cobuyer_client_id: parseInt(cobuyerClientId),
              relationship_id: parseInt(relationshipId),
            },
          })
        : mockDb.client_has_cobuyer.create({
            data: {
              buyer_client_id: parseInt(buyerClientId),
              cobuyer_client_id: parseInt(cobuyerClientId),
              relationship_id: parseInt(relationshipId),
            },
          });

      mockDb.leads.update({
        where: {
          id: leadWhereId,
        },
        data: {
          customer_cobuyer_id: data.id,
        },
      });
    }

    return NextResponse.json({ successMessage: 'Cobuyer registered' });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const clientData = await request.json();

  const cobuyerSchema = z.object({
    buyerClientId: z
      .number({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please, select a client'),
  });

  const validatedFields = cobuyerSchema.safeParse({
    buyerClientId: clientData.assigClient,
  });

  if (!validatedFields.success) {
    return NextResponse.json(
      { fieldsErrors: validatedFields.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { buyerClientId } = validatedFields.data;

  try {
    return NextResponse.json({ successMessage: 'Cobuyer deleted' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
