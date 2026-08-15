import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';
import { createEvent } from '@/app/libs/events/events';
import { createNotification } from '@/app/libs/notifications/notifications';
import { mockDb } from '@/app/libs/mock-db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  const session = await auth();

  const userId = session?.user.id;

  try {
    mockDb.clients.update({
      where: {
        id: customerId,
      },
      data: {
        credit_app_forms_completed: true,
      },
    });

    const customerData = mockDb.clients.findFirst({
      where: {
        id: customerId,
      },
    });

    if (customerData) {
      const message = `There is a new completed credit app for customer ${customerData?.first_name} ${customerData?.last_name}`;

      await createNotification({
        message: message,
        notificationType: {
          general: true,
        },
        assignedToId: customerData?.seller_id,
        notificationsForManagers: true,
        eventTypeId: 9,
      });

      mockDb.clients.update({
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

      const activeLead = mockDb.leads.findFirst({
        where: {
          customer_id: customerId,
          is_active: true,
        },
      });

      if (activeLead && activeLead.id) {
        const lead = mockDb.leads.update({
          where: {
            id: activeLead.id,
          },
          data: {
            customer_status_id: CustomersStatuses.CreditApp,
            customer_credit_app_list_status_id: 1,
            credit_app_created_at: new Date().toISOString(),
          },
        });
      }

      const description = 'Credit app completed';

      await createEvent(description, userId, customerId);
    }

    return NextResponse.json({ successMessage: 'Credit App Completed' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
