import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';
import { createEvent } from '@/app/libs/events/events';
import { createNotification } from '@/app/libs/notifications/notifications';
import prisma from '@/app/libs/prisma';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  const session = await auth();

  const userId = session?.user.id;

  try {
    await prisma.clients.update({
      where: {
        id: customerId,
      },
      data: {
        credit_app_forms_completed: true,
      },
    });

    const customerData = await prisma.clients.findFirst({
      where: {
        id: customerId,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        seller_id: true,
        credit_app_forms_completed: true,
        credit_app: {
          select: {
            id: true,
          },
        },
      },
    });

    // if (customerData && !customerData.credit_app_forms_completed) {
    if (customerData) {
      const message = `There is a new completed credit app for customer ${customerData?.first_name} ${customerData?.last_name}`;
      //
      await createNotification({
        message: message,
        notificationType: {
          general: true,
        },
        assignedToId: customerData?.seller_id,
        notificationsForManagers: true,
        eventTypeId: 9,
      });

      await prisma.clients.update({
        where: {
          id: customerData?.id,
        },
        data: {
          credit_app_forms_completed: true,
          client_status_id: 3,
          client_status_changed_at: new Date().toISOString(),
          credit_app_list_status_id: 1,
        },
      });

      const activeLead = await prisma.leads.findFirst({
        where: {
          customer_id: customerId,
          is_active: true,
        },
        select: {
          id: true,
        },
      });

      if (activeLead && activeLead.id) {
        const lead = await prisma.leads.update({
          where: {
            id: activeLead.id,
          },
          data: {
            customer_status_id: CustomersStatuses.CreditApp,
            customer_credit_app_list_status_id: 1,
            credit_app_created_at: new Date().toISOString(),
            // credit_app:
            //   customerData.credit_app?.length > 0
            //     ? {
            //         connect: {
            //           id: customerData.credit_app[0].id,
            //         },
            //       }
            //     : undefined,
          },
        });
      }

      const description = 'Credit app completed';

      await createEvent(description, userId, customerId);
    }

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Credit App Completed' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
