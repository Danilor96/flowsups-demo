import { seedUsers } from './users';
import { seedClients } from './clients';
import { seedTaskStatuses } from './settings';
import { seedTaskNotes } from './taskNotes';

const seller = seedUsers[1];
const seller2 = seedUsers[2];
const bdc = seedUsers[5];
const salesManager = seedUsers[3];
const financeManager = seedUsers[4];

export const seedTasks = [
  {
    id: 1,
    title: 'Follow up with Alice Johnson',
    description: 'Call the customer to confirm the appointment for next week.',
    assigned_to: seller.id,
    assigned_seller_id: null,
    assigned_bdc_id: null,
    assigned_manager_id: null,
    assigned_finance_manager_id: null,
    customer_id: 1,
    interested_vehicle_id: null,
    created_by: bdc.id,
    created_at: new Date('2026-08-10T10:00:00.000Z'),
    status: 2,
    deadline: new Date('2026-08-15T17:00:00.000Z'),
    updated_at: null,
    finished_at: null,
    manager_task: false,
    completed_by: null,
    assigned_to_all_managers: null,
    is_funding_task: false,
    appointment_id: null,
    reminder_sent: false,
    reminder_time_id: null,
    related_task_id: null,
  },
  {
    id: 2,
    title: 'Send credit app to Brian Miller',
    description: 'Send the credit application link and confirm receipt.',
    assigned_to: seller2.id,
    assigned_seller_id: null,
    assigned_bdc_id: null,
    assigned_manager_id: null,
    assigned_finance_manager_id: null,
    customer_id: 2,
    interested_vehicle_id: null,
    created_by: bdc.id,
    created_at: new Date('2026-08-11T09:30:00.000Z'),
    status: 1,
    deadline: new Date('2026-08-14T18:00:00.000Z'),
    updated_at: null,
    finished_at: null,
    manager_task: false,
    completed_by: null,
    assigned_to_all_managers: null,
    is_funding_task: false,
    appointment_id: null,
    reminder_sent: false,
    reminder_time_id: null,
    related_task_id: null,
  },
  {
    id: 3,
    title: 'Confirm delivery for Veronica Lopez',
    description: 'Verify financing and confirm the vehicle delivery date.',
    assigned_to: seller.id,
    assigned_seller_id: null,
    assigned_bdc_id: null,
    assigned_manager_id: null,
    assigned_finance_manager_id: null,
    customer_id: 3,
    interested_vehicle_id: null,
    created_by: 1,
    created_at: new Date('2026-08-12T14:00:00.000Z'),
    status: 5,
    deadline: new Date('2026-08-16T19:00:00.000Z'),
    updated_at: new Date('2026-08-12T15:00:00.000Z'),
    finished_at: null,
    manager_task: false,
    completed_by: null,
    assigned_to_all_managers: null,
    is_funding_task: true,
    appointment_id: null,
    reminder_sent: false,
    reminder_time_id: null,
    related_task_id: null,
  },
  {
    id: 4,
    title: 'No answer follow up for Diana Brown',
    description: 'Customer did not answer. Attempt contact again later.',
    assigned_to: seller2.id,
    assigned_seller_id: null,
    assigned_bdc_id: null,
    assigned_manager_id: null,
    assigned_finance_manager_id: null,
    customer_id: 12,
    interested_vehicle_id: null,
    created_by: bdc.id,
    created_at: new Date('2026-08-12T16:30:00.000Z'),
    status: 1,
    deadline: new Date('2026-08-13T12:00:00.000Z'),
    updated_at: null,
    finished_at: null,
    manager_task: false,
    completed_by: null,
    assigned_to_all_managers: null,
    is_funding_task: false,
    appointment_id: null,
    reminder_sent: false,
    reminder_time_id: null,
    related_task_id: null,
  },
];

seedTasks.forEach((task: any, index: number) => {
  const client = seedClients[task.customer_id - 1];
  const assigned = task.assigned_to === seller.id ? seller : seller2;
  task.customer = {
    ...client,
    id: client.id,
    first_name: client.first_name,
    last_name: client.last_name,
    email: client.email,
    home_phone: client.home_phone,
    work_phone: client.work_phone,
    mobile_phone: client.mobile_phone,
    intereseted_vehicle_id: client.intereseted_vehicle_id,
    lead_temperature_id: client.lead_temperature_id,
    interested_vehicle: client.interested_vehicle || null,
    note: [],
    bdc: bdc,
    seller: assigned,
    sales_manager: salesManager,
    finance_manager: financeManager,
  };
  task.assigned = {
    id: assigned.id,
    name: assigned.name,
    last_name: assigned.last_name,
    username: assigned.username,
  };
  task.assigned_seller = {
    id: assigned.id,
    name: assigned.name,
    last_name: assigned.last_name,
    username: assigned.username,
  };
  task.assigned_bdc = {
    id: bdc.id,
    name: bdc.name,
    last_name: bdc.last_name,
    username: bdc.username,
  };
  task.assigned_manager = {
    id: salesManager.id,
    name: salesManager.name,
    last_name: salesManager.last_name,
    username: salesManager.username,
  };
  task.assigned_finance_manager = {
    id: financeManager.id,
    name: financeManager.name,
    last_name: financeManager.last_name,
    username: financeManager.username,
  };
  task.task_status = seedTaskStatuses.find((status: any) => status.id === task.status) || null;
  task.interested_vehicle = null;
  task.notes = task.id === 1 ? [seedTaskNotes[0]] : [];
  task.created_by_user = {
    id: task.created_by,
    name: seedUsers[task.created_by]?.name || seedUsers[0].name,
    last_name: seedUsers[task.created_by]?.last_name || seedUsers[0].last_name,
  };
});