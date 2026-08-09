import prisma from '@/app/libs/prisma';
import { io } from 'socket.io-client';

interface EventType {
  ['appointments']?: boolean;
  ['note creation']?: boolean;
  ['customer arrival (daily activity)']?: boolean;
  ['task assignation']?: boolean;
  ['customer marked as lost']?: boolean;
  ['appointment reschedule request']?: boolean;
  ['customer status change']?: boolean;
  ['application submitted by a customer']?: boolean;
  ['credit app completed']?: boolean;
  ['deposit made']?: boolean;
  ['temperature change']?: boolean;
  ['user role change']?: boolean;
  ['user activate/deactivate']?: boolean;
  ['appointment accepted']?: boolean;
  ['max missed tasks counter']?: boolean;
  ['expired appointments']?: boolean;
  ['delivery scheduled reminder']?: boolean;
  ['delivery scheduled expired']?: boolean;
  ['appointment reschedule reminder']?: boolean;
  ['task expired']?: boolean;
  ['missing call']?: boolean;
  ['sms sending error']?: boolean;
  ['appointment cancelation request']?: boolean;
  ['delivery schedule']?: boolean;
  ['sms from customer']?: boolean;
  ['appointment expired']?: boolean;
  ['appointment reschedule']?: boolean;
}

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:3001';

export async function createNotification({
  notificationType,
  assignedToId,
  customerId,
  message,
  appointmentId,
  taskId,
  notificationsForManagers,
  exclusiveManagerNotification,
  unregisteredCustomerId,
  eventTypeId,
  eventType,
}: {
  notificationType: {
    general?: boolean;
    appointment?: boolean;
    inventory?: boolean;
    customer?: boolean;
    warning?: boolean;
  };
  assignedToId?: number | null;
  customerId?: number;
  message: string;
  appointmentId?: number;
  taskId?: number;
  notificationsForManagers?: boolean;
  eventTypeId?: number;
  eventType?: EventType;
  exclusiveManagerNotification?: boolean;
  unregisteredCustomerId?: number;
}) {
  let socket;
  try {
    const { general, appointment, customer, inventory, warning } = notificationType;

    let finalEventTypeId = eventTypeId;

    if (!finalEventTypeId && eventType) {
      const selectedEventTypeKey = Object.keys(eventType).find(key => eventType[key as keyof EventType]) as
        | keyof EventType
        | undefined;

      if (selectedEventTypeKey) {
        const eventTypeData = await prisma.events_types.findFirst({
          where: {
            type: selectedEventTypeKey,
          },
          select: { id: true },
        });
        finalEventTypeId = eventTypeData?.id;
      }
    }

    if (finalEventTypeId && assignedToId) {
      const notiPreference = await prisma.notifications_preferences.findFirst({
        where: { event_type_id: finalEventTypeId },
      });

      if (notiPreference) {
        const exists = notiPreference.user_ids.includes(assignedToId);
        if (!exists) return;
      }
    }

    const managerUsersIds: number[] = [];
    let notiType = 1;

    if (appointment) notiType = 2;
    if (inventory) notiType = 3;
    if (customer) notiType = 4;
    if (warning) notiType = 5;

    const notificationsToCreate = [];
    const now = new Date();

    if (notificationsForManagers) {
      const managerUsers = await prisma.users.findMany({
        where: {
          user_has: {
            some: {
              role_id: {
                in: [1, 2, 3, 4],
              },
            },
          },
          deleted_at: null,
        },
        select: { id: true },
      });

      for (const user of managerUsers) {
        managerUsersIds.push(user.id);
        notificationsToCreate.push({
          message: message,
          user_id: user.id,
          customer_id: customerId,
          type_id: notiType,
          appointment_id: appointmentId,
          task_id: taskId,
          created_at: now.toISOString(),
          is_read: false,
          is_deleted: false,
          event_type_id: finalEventTypeId,
          notification_for_managers: false,
          unregistered_customer_id: unregisteredCustomerId,
        });
      }

      if (notificationsToCreate.length > 0) {
        await prisma.notifications.createMany({
          data: notificationsToCreate,
        });
      }

      if (exclusiveManagerNotification) {
        socket = io(socketUrl);
        socket.emit('ask_for_update_data', 'notifications');
        socket.close();
        return;
      }
    }

    if (assignedToId && !managerUsersIds.includes(assignedToId)) {
      await prisma.notifications.create({
        data: {
          message: message,
          user_id: assignedToId,
          customer_id: customerId,
          type_id: notiType,
          appointment_id: appointmentId,
          task_id: taskId,
          created_at: now.toISOString(),
          is_read: false,
          is_deleted: false,
          event_type_id: finalEventTypeId,
          notification_for_managers: false,
          unregistered_customer_id: unregisteredCustomerId,
        },
      });
    }

    if (!socket) socket = io(socketUrl);
    socket.emit('ask_for_update_data', 'notifications');
    socket.close();
  } catch (error) {
    console.log(error);
  }
}
