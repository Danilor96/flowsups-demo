import { z } from 'zod';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { createEvent } from '@/app/libs/events/events';
import { ActivityType, sellerActivityEventEmitterAsync } from '@/app/libs/services/salesPointsService';
import { FundingStatuses } from '@/app/libs/customer/customersFunctions';
import { createNotification } from '@/app/libs/notifications/notifications';
import { LeadHistoryCategoriesEnum } from '@/app/ui/dashboard/clientSystem/clientDetail/leadHistory/categoriesIdMap';
import { auth } from '@/auth';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const createdByUserId = session?.user.id;

  const customerId = parseInt(params.id);

  const formData = await request.formData();

  const noteSchema = z.object({
    followUpDate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value').nullish(),
    dealDate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    assignedTo: z
      .array(z.string({ invalid_type_error: 'Please enter a valid value' }))
      .min(1, 'Please enter a value'),
    reminderTime: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value').nullish(),
    note: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    createdBy: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    todaysDate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const assignedArray = formData.get('assignedTo');

  const validatedData = noteSchema.safeParse({
    followUpDate: formData.get('followUpDate'),
    dealDate: formData.get('dealDate'),
    assignedTo: typeof assignedArray === 'string' ? JSON.parse(assignedArray) : [],
    reminderTime: formData.get('reminderTime'),
    note: formData.get('note'),
    createdBy: formData.get('createdBy'),
    todaysDate: formData.get('todaysDate'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { assignedTo, followUpDate, note, reminderTime, createdBy, todaysDate, dealDate } =
    validatedData.data;

  try {
    let noteId: number | null = null;

    if (note) {
      const noteData = await prisma?.notes.create({
        data: {
          note: note,
          created_at: todaysDate,
          created_by_id: parseInt(createdBy),
          client_id: customerId,
        },
        select: {
          id: true,
        },
      });

      noteId = noteData.id;
    }

    await prisma.client_has_lead.create({
      data: {
        created_at: todaysDate,
        assigned_to_id: parseInt(assignedTo[0]),
        client_id: customerId,
        status_id: 2,
        created_by_id: parseInt(createdBy),
        lead_id: 14,
        follow_up_date: followUpDate ? new Date(followUpDate) : null,
        note_id: noteId,
      },
    });

    const lead = await prisma.leads.updateMany({
      where: {
        customer_id: customerId,
        is_active: true,
        has_ended: false,
      },
      data: {
        has_ended: true,
        end_at: new Date().toISOString(),
        customer_status_id: 10,
        sold_created_at: new Date().toISOString(),
        customer_funding_list_status_id: FundingStatuses.InProcess,
        sales_rep_id: parseInt(assignedTo[0]),
      },
    });

    const soldCustomer = await prisma.clients.update({
      where: {
        id: customerId,
      },
      data: {
        lead_temperature_id: null,
        client_status_changed_at: new Date(),
        funding_list_status_id: FundingStatuses.InProcess,
        seller_id: parseInt(assignedTo[0]),
      },
    });

    if(soldCustomer.intereseted_vehicle_id) {
      await prisma.vehicles.update({
        where: {
          id: soldCustomer.intereseted_vehicle_id,
        },
        data: {
          vehicle_status_id: 3,
        },
      });
    }

    const message = `The status of customer ${soldCustomer.first_name} ${soldCustomer.last_name} has change to Sold`;

    await createNotification({
      message: message,
      notificationType: {
        general: true,
      },
      assignedToId: parseInt(assignedTo[0]),
      notificationsForManagers: true,
      eventTypeId: 7,
    });

    const descriptionEvent = 'Status changed to sold in Options Lead';

    if (createdByUserId) {
      await createLeadHistory({
        description: descriptionEvent,
        customerId,
        userId: createdByUserId,
        categoryId: LeadHistoryCategoriesEnum.Sold,
      });
    }

    // logic for assigning points to sellers
    if (soldCustomer.seller_id) {
      // event is sent to the socket server to run the seller activity counter in the background without adding latency to the current response.
      sellerActivityEventEmitterAsync({
        userId: soldCustomer.seller_id,
        activityType: ActivityType.CUSTOMER_SOLD,
      });
    }

    //await prisma.$disconnect();

    const description = 'New Lead created: Sold';

    await createEvent(descriptionEvent, createdByUserId, customerId);
    
    sellerActivityEventEmitterAsync({
      userId: parseInt(assignedTo[0]),
      activityType: ActivityType.CUSTOMER_SOLD,
    });
    
    return NextResponse.json({ successMessage: 'Lead Successfully Created' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

async function createLeadHistory({
  description,
  customerId,
  userId,
  categoryId,
}: {
  description: string;
  customerId: number;
  userId: number;
  categoryId: LeadHistoryCategoriesEnum;
}) {
  await prisma.notes.create({
    data: {
      created_at: new Date(),
      note: description,
      client_id: customerId,
      created_by_id: userId,
      client_lead_note: {
        create: {
          created_at: new Date(),
          client_id: customerId,
          status_id: 2,
          created_by_id: userId,
          lead_id: categoryId,
        },
      },
    },
  });
}
