import { checkPermissions } from '@/app/libs/auth-helpers';
import { createEvent } from '@/app/libs/events/events';
import { createNotification } from '@/app/libs/notifications/notifications';
import { mockDb } from '@/app/libs/mock-db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(71);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const urlRequest = new URL(request.url);

  const searchParams = urlRequest.searchParams;

  const currentLeadId = searchParams.get('leadId');

  const id = params.id;
  const formData = await request.formData();

  const session = await auth();

  const userId = session?.user.id;

  const leadSquema = z.object({
    lead_temperature: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = leadSquema.safeParse({
    lead_temperature: formData.get('lead_temperature'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { lead_temperature } = validatedData.data;

  try {
    let leadWhereClause: Record<string, any> | null = null;

    if (currentLeadId) {
      leadWhereClause = {
        id: Number(currentLeadId),
      };
    } else {
      const activeLead = await mockDb.leads.findFirst({
        where: {
          customer_id: Number(id),
          is_selected: true,
          is_active: true,
        },
      });

      leadWhereClause = {
        id: activeLead?.id,
      };
    }

    if (leadWhereClause && leadWhereClause.id) {
      await mockDb.leads.update({
        where: leadWhereClause,
        data: {
          lead_temperature_id: parseInt(lead_temperature),
        },
      });
    }

    if (!currentLeadId) {
      const data = await mockDb.clients.update({
        where: {
          id: parseInt(id),
        },
        data: {
          lead_temperature_id: parseInt(lead_temperature),
        },
      });

      const message = `${data.first_name} ${data.last_name} temperature changed to ${data.client_lead_temperature?.temperature}`;

      await createNotification({
        message: message,
        notificationType: {
          general: true,
        },
        assignedToId: data.seller_id,
        customerId: data.id,
        notificationsForManagers: true,
        eventTypeId: 11,
      });

      const description = `temperature changed to ${data.client_lead_temperature?.temperature}`;

      await createEvent(description, userId, parseInt(id));
    }

    return NextResponse.json({ successMessage: 'Lead Temperature Successfully Setted' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
