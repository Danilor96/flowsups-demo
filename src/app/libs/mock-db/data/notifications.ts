export const seedNotificationsPreferences = [
  { id: 1, event_type_id: 1, user_ids: [1, 2, 3, 4, 5, 6, 7, 8] },
  { id: 2, event_type_id: 2, user_ids: [1, 2, 3, 4] },
  { id: 3, event_type_id: 8, user_ids: [1, 2, 3, 4] },
  { id: 4, event_type_id: 9, user_ids: [1, 2, 3, 4, 5, 6, 7, 8] },
];

export const seedNotifications = [
  {
    id: 1,
    message: 'There is a new completed credit app for customer Maria Rodriguez',
    user_id: 1,
    customer_id: 1,
    type_id: 1,
    appointment_id: null,
    task_id: null,
    created_at: new Date('2026-08-11T16:00:00.000Z'),
    is_read: false,
    is_deleted: false,
    event_type_id: 9,
    notification_for_managers: false,
    unregistered_customer_id: null,
  },
  {
    id: 2,
    message: 'There is a new completed credit app for customer John Smith',
    user_id: 2,
    customer_id: 2,
    type_id: 1,
    appointment_id: null,
    task_id: null,
    created_at: new Date('2026-08-11T17:00:00.000Z'),
    is_read: false,
    is_deleted: false,
    event_type_id: 9,
    notification_for_managers: false,
    unregistered_customer_id: null,
  },
  {
    id: 3,
    message: 'Appointment scheduled for customer Ana Garcia',
    user_id: 3,
    customer_id: 3,
    type_id: 2,
    appointment_id: 3,
    task_id: null,
    created_at: new Date('2026-08-12T10:00:00.000Z'),
    is_read: false,
    is_deleted: false,
    event_type_id: 2,
    notification_for_managers: false,
    unregistered_customer_id: null,
  },
  {
    id: 4,
    message: 'New inventory vehicle added to the lot',
    user_id: 1,
    customer_id: null,
    type_id: 3,
    appointment_id: null,
    task_id: null,
    created_at: new Date('2026-08-13T09:00:00.000Z'),
    is_read: false,
    is_deleted: false,
    event_type_id: 3,
    notification_for_managers: true,
    unregistered_customer_id: null,
  },
  {
    id: 5,
    message: 'Customer reached out for follow-up',
    user_id: 2,
    customer_id: 4,
    type_id: 4,
    appointment_id: null,
    task_id: null,
    created_at: new Date('2026-08-14T11:30:00.000Z'),
    is_read: false,
    is_deleted: false,
    event_type_id: 4,
    notification_for_managers: true,
    unregistered_customer_id: null,
  },
  {
    id: 6,
    message: 'Deposit payment overdue warning',
    user_id: 3,
    customer_id: null,
    type_id: 5,
    appointment_id: null,
    task_id: null,
    created_at: new Date('2026-08-15T08:00:00.000Z'),
    is_read: true,
    is_deleted: false,
    event_type_id: 5,
    notification_for_managers: true,
    unregistered_customer_id: null,
  },
];

export const seedNotificationUsers = [
  { id: 1, name: 'John', last_name: 'Doe', email: 'john@flowsupsdemo.com' },
  { id: 2, name: 'Maria', last_name: 'Lopez', email: 'maria@flowsupsdemo.com' },
  { id: 3, name: 'Carlos', last_name: 'Ramirez', email: 'carlos@flowsupsdemo.com' },
];

seedNotifications.forEach((notification: any) => {
  const customer = notification.customer_id
    ? {
        first_name: notification.message.includes('Maria') ? 'Maria' : notification.message.includes('John') ? 'John' : notification.message.includes('Ana') ? 'Ana' : 'Carlos',
        last_name: notification.message.includes('Maria') ? 'Rodriguez' : notification.message.includes('John') ? 'Smith' : notification.message.includes('Ana') ? 'Garcia' : 'Perez',
        id: notification.customer_id,
        email: `customer${notification.customer_id}@flowsupsdemo.com`,
      }
    : null;

  const user = seedNotificationUsers.find((u) => u.id === notification.user_id);

  notification.customers = customer;
  notification.user = user ? { ...user } : { name: 'Unknown', last_name: 'User', id: notification.user_id, email: null };
  notification.unregistered_customer = notification.unregistered_customer_id
    ? { mobile_phone_number: `3055550${notification.unregistered_customer_id}` }
    : null;
});