import { mockDb } from '@/app/libs/mock-db';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createNotification } from '@/app/libs/notifications/notifications';
import { auth } from '@/auth';
import { createEvent } from '@/app/libs/events/events';
import { LeadHistoryCategoriesEnum as LeadCategoriesEnum } from '&/dashboard/clientSystem/clientDetail/leadHistory/categoriesIdMap';
import { checkPermissions } from '@/app/libs/auth-helpers';
import { Permissions } from '@/app/libs/definitions/permissions/permissions';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions([
    Permissions.CustomerMarkAsLost,
    Permissions.CustomerEstablishStatus,
  ]);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const customerId = parseInt(params.id);

  const session = await auth();

  const user = session?.user;

  const formData = await request.formData();

  const customerStatusSchema = z.object({
    statusSelected: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    note: z.string({ invalid_type_error: 'Please enter a valid value' }).nullish(),
    lostReasonDescription: z.string({ invalid_type_error: 'Please enter a valid value' }).nullish(),
    lostReason: z.coerce.number().min(1, 'Lost reason require'),
    leadId: z.coerce.number().min(1, 'Lead require'),
  });

  const validatedData = customerStatusSchema.safeParse({
    statusSelected: formData.get('statusSelected'),
    note: formData.get('note'),
    lostReason: formData.get('lostReason'),
    lostReasonDescription: formData.get('lostReasonDescription'),
    leadId: formData.get('leadId')
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { statusSelected, note, lostReason, lostReasonDescription, leadId } = validatedData.data;

  try {
    const prevCurrentClientData = mockDb.clients.findUnique({
      where: { id: customerId },
    });

    const prevActiveLeadData = mockDb.leads.findFirst({
      where: {
        customer_id: customerId,
        id: leadId,
      },
    });

    const prevStatus = prevActiveLeadData?.customer_status

    const clientUpdated = mockDb.clients.update({
      where: {
        id: customerId,
      },
      data: {
        client_status_id: parseInt(statusSelected),
        client_status_changed_at: new Date(),
        lost_reason_id: lostReason,
      },
    });

    const activeLead = prevActiveLeadData;

    if (activeLead && activeLead.id) {
      const lead = mockDb.leads.update({
        where: {
          id: activeLead.id,
        },
        data: {
          customer_status_id: parseInt(statusSelected),
        },
      });
    }

    const todaysDate = new Date();
    let noteId: number | null = null;
    if (!note && lostReasonDescription) {
      // lost status
      const noteDb = mockDb.notes.create({
        data: {
          note: lostReasonDescription,
          created_at: todaysDate,
          created_by_id: user?.id || 0,
          client_id: customerId,
          from_id: 3,
        },
      });

      noteId = noteDb.id;
    }
    if (note) {
      const noteDb = mockDb.notes.create({
        data: {
          note: note,
          created_at: todaysDate,
          created_by_id: user?.id || 0,
          client_id: customerId,
          from_id: 3,
        },
      });

      noteId = noteDb.id;
    }

    // Release vehicle if customer was Sold and now is NOT Sold/Funded (e.g., Lost)
    const prevCustomerLeadStatusAssigned = activeLead?.customer_status?.id;

    const prevVehicleId = activeLead?.vehicle?.id;
    const prevLeadVehicleStatusAssigned = activeLead?.vehicle?.vehicle_status_id;

    const isSoldStatus = parseInt(statusSelected) === CustomersStatuses.Sold;
    const isFundedStatus = parseInt(statusSelected) === CustomersStatuses.Funded;

    if (prevCustomerLeadStatusAssigned === CustomersStatuses.Sold && !isSoldStatus && !isFundedStatus) {
      if (prevVehicleId && prevLeadVehicleStatusAssigned === 3) {
        // 3 = vehicle sold
        mockDb.vehicles.update({
          where: { id: prevVehicleId },
          data: { vehicle_status_id: 1 }, // In Stock
        });
      }
    }

    mockDb.client_has_lead.create({
      data: {
        created_at: todaysDate,
        client_id: customerId,
        status_id: 2,
        created_by_id: user?.id || 0,
        lead_id: LeadCategoriesEnum.MarkAsLost,
        note_id: noteId || null,
      },
    });

    const currentClientStatus = clientUpdated.client_status_id
      ? mockDb.client_status.findUnique({ where: { id: clientUpdated.client_status_id } })
      : null;

    const statusName = currentClientStatus?.status || '';

    const byUserName = `${user?.name || ''} ${user?.last_name || ''}`;

    const description = `${byUserName} changed status from '${prevStatus?.status.toLocaleUpperCase()}' to '${statusName.toLocaleUpperCase()}' for customer ${
      clientUpdated.first_name
    } ${clientUpdated.last_name}`;

    await createNotification({
      message: description,
      notificationType: {
        general: true,
      },
      customerId: customerId,
      notificationsForManagers: true,
      eventTypeId: 7,
    });

    if (user?.id) await createEvent(description, user.id, customerId, new Date());

    return NextResponse.json({ successMessage: 'Status Successfully Changed' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
