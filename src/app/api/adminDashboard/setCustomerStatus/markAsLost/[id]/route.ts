import prisma from '@/app/libs/prisma';
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
    const prevCurrentClientData = await prisma.clients.findUnique({
      where: { id: customerId },
      select: {
        id: true,
        client_status_id: true,
        intereseted_vehicle_id: true,
        interested_vehicle: {
          select: {
            id: true,
            vehicle_status_id: true,
          },
        },
        // client_status: true,
        deleted: true,
        first_name: true,
        last_name: true,
      },
    });

    const prevActiveLeadData = await prisma.leads.findFirst({
      where: {
        customer_id: customerId,
        id: leadId,
      },
      select: {
        id: true,
        customer_status: true,
        vehicle: {
          select: {
            id: true,
            vehicle_status_id: true,
          },
        },
      },
    });

    const prevStatus = prevActiveLeadData?.customer_status

    const clientUpdated = await prisma.clients.update({
      where: {
        id: customerId,
      },
      data: {
        client_status_id: parseInt(statusSelected),
        client_status_changed_at: new Date(),
        lost_reason_id: lostReason,
      },
      include: {
        client_status: true,
      },
    });

    const activeLead = prevActiveLeadData;

    if (activeLead && activeLead.id) {
      const lead = await prisma.leads.update({
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
      const noteDb = await prisma.notes.create({
        data: {
          note: lostReasonDescription,
          created_at: todaysDate,
          created_by_id: user?.id || 0,
          client_id: customerId,
          from_id: 3,
        },
        select: {
          id: true,
        },
      });

      noteId = noteDb.id;
    }
    if (note) {
      const noteDb = await prisma.notes.create({
        data: {
          note: note,
          created_at: todaysDate,
          created_by_id: user?.id || 0,
          client_id: customerId,
          from_id: 3,
        },
        select: {
          id: true,
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
        await prisma.vehicles.update({
          where: { id: prevVehicleId },
          data: { vehicle_status_id: 1 }, // In Stock
        });
      }
    }

    await prisma.client_has_lead.create({
      data: {
        created_at: todaysDate,
        client_id: customerId,
        status_id: 2,
        created_by_id: user?.id || 0,
        lead_id: LeadCategoriesEnum.MarkAsLost,
        note_id: noteId || null,
      },
    });

    const statusName = clientUpdated.client_status?.status || '';

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

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Status Successfully Changed' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
