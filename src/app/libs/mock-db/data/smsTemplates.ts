import { seedUsers } from './users';

const demoUser = seedUsers[0];
const user2 = seedUsers[1];
const user3 = seedUsers[2];

export const seedSmsTemplateCategories = [
  { id: 1, category: 'General' },
  { id: 2, category: 'Appointments' },
  { id: 3, category: 'Follow Up' },
  { id: 4, category: 'Credit App' },
  { id: 5, category: 'Delivery' },
];

export const seedSmsTemplates = [
  {
    id: 1,
    name: 'Appointment Confirmation',
    template:
      'Hi {customer.first_name}, your appointment is confirmed for {appointment.appointment_date}. Reply STOP to opt out.',
    category_id: 2,
    created_by: demoUser.id,
    creted_date: new Date('2026-07-01T09:00:00.000Z'),
    published: true,
    favorite: true,
    category: seedSmsTemplateCategories[1],
    user: {
      id: demoUser.id,
      name: demoUser.name,
      last_name: demoUser.last_name,
      username: demoUser.username,
    },
  },
  {
    id: 2,
    name: 'Follow Up',
    template:
      'Hi {customer.first_name}, we tried to reach you. Please give us a call when you get a chance.',
    category_id: 3,
    created_by: user2.id,
    creted_date: new Date('2026-07-05T10:00:00.000Z'),
    published: true,
    favorite: false,
    category: seedSmsTemplateCategories[2],
    user: {
      id: user2.id,
      name: user2.name,
      last_name: user2.last_name,
      username: user2.username,
    },
  },
  {
    id: 3,
    name: 'Credit App Invitation',
    template:
      'Hi {customer.first_name}, here is the link to complete your credit application: {admin.consent_link}',
    category_id: 4,
    created_by: demoUser.id,
    creted_date: new Date('2026-07-10T11:30:00.000Z'),
    published: true,
    favorite: false,
    category: seedSmsTemplateCategories[3],
    user: {
      id: demoUser.id,
      name: demoUser.name,
      last_name: demoUser.last_name,
      username: demoUser.username,
    },
  },
  {
    id: 4,
    name: 'Vehicle Delivery',
    template:
      'Hi {customer.first_name}, your {inventory.interested_vehicle_year} {inventory.interested_vehicle_model} is ready for delivery.',
    category_id: 5,
    created_by: user3.id,
    creted_date: new Date('2026-07-15T08:45:00.000Z'),
    published: false,
    favorite: false,
    category: seedSmsTemplateCategories[4],
    user: {
      id: user3.id,
      name: user3.name,
      last_name: user3.last_name,
      username: user3.username,
    },
  },
  {
    id: 5,
    name: 'Welcome',
    template:
      'Hi {customer.first_name}, welcome to Flowsups! We are excited to work with you.',
    category_id: 1,
    created_by: demoUser.id,
    creted_date: new Date('2026-07-20T14:00:00.000Z'),
    published: true,
    favorite: false,
    category: seedSmsTemplateCategories[0],
    user: {
      id: demoUser.id,
      name: demoUser.name,
      last_name: demoUser.last_name,
      username: demoUser.username,
    },
  },
];

export const seedSmsTemplateVariablesCategories = [
  { id: 1, category: 'Customer' },
  { id: 2, category: 'Inventory' },
  { id: 3, category: 'Admin' },
];

export const seedSmsTemplateVariablesTagged = [
  { id: 1, sms_template_variable_id: 1, user_id: demoUser.id },
  { id: 2, sms_template_variable_id: 2, user_id: user2.id },
  { id: 3, sms_template_variable_id: 3, user_id: demoUser.id },
];

export const seedSmsTemplateVariables = [
  {
    id: 1,
    variable: 'customer.first_name',
    category_id: 1,
    category: seedSmsTemplateVariablesCategories[0],
    variable_tag: [seedSmsTemplateVariablesTagged[0]],
  },
  {
    id: 2,
    variable: 'customer.last_name',
    category_id: 1,
    category: seedSmsTemplateVariablesCategories[0],
    variable_tag: [seedSmsTemplateVariablesTagged[1]],
  },
  {
    id: 3,
    variable: 'customer.mobile',
    category_id: 1,
    category: seedSmsTemplateVariablesCategories[0],
    variable_tag: [seedSmsTemplateVariablesTagged[2]],
  },
  {
    id: 4,
    variable: 'inventory.interested_vehicle_model',
    category_id: 2,
    category: seedSmsTemplateVariablesCategories[1],
    variable_tag: [],
  },
  {
    id: 5,
    variable: 'inventory.interested_vehicle_price',
    category_id: 2,
    category: seedSmsTemplateVariablesCategories[1],
    variable_tag: [],
  },
  {
    id: 6,
    variable: 'admin.sales_rep_email',
    category_id: 3,
    category: seedSmsTemplateVariablesCategories[2],
    variable_tag: [],
  },
];

export const seedAwaitingUnknowClients = [
  {
    id: 1,
    mobile_phone_number: '3055557777',
    email: null,
    user_id: null,
    created_at: new Date('2026-08-01T10:00:00.000Z'),
    last_activity: new Date('2026-08-12T08:44:00.000Z'),
  },
  {
    id: 2,
    mobile_phone_number: '3055558888',
    email: null,
    user_id: null,
    created_at: new Date('2026-08-02T11:00:00.000Z'),
    last_activity: new Date('2026-08-11T14:12:00.000Z'),
  },
];

export const seedClientBulkSms = [
  {
    id: 1,
    message: 'Hi {customer.first_name}, this is a bulk demo message from Flowsups.',
    date_sent: new Date('2026-08-11T16:00:00.000Z'),
    created_at: new Date('2026-08-11T16:00:00.000Z'),
    completed_at: new Date('2026-08-11T16:01:00.000Z'),
    sent_by_user_id: demoUser.id,
    total_recipients: 3,
    successfully_sent: 3,
    failed_to_send: 0,
    bulk_sms_creator: {
      id: demoUser.id,
      name: demoUser.name,
      last_name: demoUser.last_name,
    },
  },
];
