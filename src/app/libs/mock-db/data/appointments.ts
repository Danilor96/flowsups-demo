import { seedClients } from './clients';
import { seedUsers } from './users';
import { seedClientHasLead } from './leads';

export const seedAppointmentStatuses = [
  { id: 1, status: 'Scheduled' },
  { id: 2, status: 'Confirmed' },
  { id: 3, status: 'Canceled' },
  { id: 4, status: 'Rescheduled' },
  { id: 5, status: 'No Show' },
  { id: 6, status: 'Completed' },
];

const dayOffset = (offset: number): Date => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date;
};

const at = (offset: number, hour: number, minute = 0): Date => {
  const date = dayOffset(offset);
  date.setHours(hour, minute, 0, 0);
  return date;
};

const client1 = seedClients[0];
const client2 = seedClients[1];
const client3 = seedClients[2];
const client7 = seedClients[6];
const client11 = seedClients[10];
const client12 = seedClients[11];

const sarah = seedUsers[1];
const james = seedUsers[2];
const demo = seedUsers[0];

export const seedAppointments = [
  {
    id: 1,
    start_date: at(1, 10, 0),
    end_date: at(1, 11, 0),
    prevented_start_date: null,
    prevented_end_date: null,
    status_id: 2,
    client_accept_appointment: true,
    customer_id: client1.id,
    user_id: sarah.id,
    waiting_aprove: false,
    change_reason: null,
    created_by: demo.id,
    created_at: new Date('2026-08-05T09:00:00.000Z'),
    last_check: null,
    confirmation_sent: true,
    reminder_sent: false,
    reminder_time_id: 3,
    appointments_status: seedAppointmentStatuses[1],
    customers: { ...client1 },
    users: { ...sarah },
    creator: { ...demo },
  },
  {
    id: 2,
    start_date: at(0, 9, 0),
    end_date: at(0, 10, 0),
    prevented_start_date: null,
    prevented_end_date: null,
    status_id: 2,
    client_accept_appointment: true,
    customer_id: client2.id,
    user_id: james.id,
    waiting_aprove: false,
    change_reason: null,
    created_by: demo.id,
    created_at: new Date('2026-08-10T08:00:00.000Z'),
    last_check: null,
    confirmation_sent: true,
    reminder_sent: false,
    reminder_time_id: 2,
    appointments_status: seedAppointmentStatuses[1],
    customers: { ...client2 },
    users: { ...james },
    creator: { ...demo },
  },
  {
    id: 3,
    start_date: at(0, 14, 0),
    end_date: at(0, 15, 0),
    prevented_start_date: null,
    prevented_end_date: null,
    status_id: 1,
    client_accept_appointment: false,
    customer_id: client3.id,
    user_id: sarah.id,
    waiting_aprove: false,
    change_reason: null,
    created_by: demo.id,
    created_at: new Date('2026-08-11T11:00:00.000Z'),
    last_check: null,
    confirmation_sent: false,
    reminder_sent: false,
    reminder_time_id: 1,
    appointments_status: seedAppointmentStatuses[0],
    customers: { ...client3 },
    users: { ...sarah },
    creator: { ...demo },
  },
  {
    id: 4,
    start_date: at(2, 11, 0),
    end_date: at(2, 12, 0),
    prevented_start_date: null,
    prevented_end_date: null,
    status_id: 1,
    client_accept_appointment: false,
    customer_id: client7.id,
    user_id: james.id,
    waiting_aprove: false,
    change_reason: null,
    created_by: demo.id,
    created_at: new Date('2026-08-12T09:30:00.000Z'),
    last_check: null,
    confirmation_sent: false,
    reminder_sent: false,
    reminder_time_id: null,
    appointments_status: seedAppointmentStatuses[0],
    customers: { ...client7 },
    users: { ...james },
    creator: { ...demo },
  },
  {
    id: 5,
    start_date: at(3, 15, 0),
    end_date: at(3, 16, 0),
    prevented_start_date: null,
    prevented_end_date: null,
    status_id: 2,
    client_accept_appointment: true,
    customer_id: client11.id,
    user_id: sarah.id,
    waiting_aprove: false,
    change_reason: null,
    created_by: demo.id,
    created_at: new Date('2026-08-12T10:00:00.000Z'),
    last_check: null,
    confirmation_sent: true,
    reminder_sent: false,
    reminder_time_id: 2,
    appointments_status: seedAppointmentStatuses[1],
    customers: { ...client11 },
    users: { ...sarah },
    creator: { ...demo },
  },
  {
    id: 6,
    start_date: at(4, 13, 0),
    end_date: at(4, 14, 0),
    prevented_start_date: null,
    prevented_end_date: null,
    status_id: 1,
    client_accept_appointment: false,
    customer_id: client12.id,
    user_id: james.id,
    waiting_aprove: false,
    change_reason: null,
    created_by: demo.id,
    created_at: new Date('2026-08-12T12:00:00.000Z'),
    last_check: null,
    confirmation_sent: false,
    reminder_sent: false,
    reminder_time_id: null,
    appointments_status: seedAppointmentStatuses[0],
    customers: { ...client12 },
    users: { ...james },
    creator: { ...demo },
  },
  {
    id: 7,
    start_date: at(-1, 16, 0),
    end_date: at(-1, 17, 0),
    prevented_start_date: null,
    prevented_end_date: null,
    status_id: 6,
    client_accept_appointment: true,
    customer_id: client3.id,
    user_id: sarah.id,
    waiting_aprove: false,
    change_reason: null,
    created_by: demo.id,
    created_at: new Date('2026-08-06T10:00:00.000Z'),
    last_check: null,
    confirmation_sent: true,
    reminder_sent: true,
    reminder_time_id: 3,
    appointments_status: seedAppointmentStatuses[5],
    customers: { ...client3 },
    users: { ...sarah },
    creator: { ...demo },
  },
  {
    id: 8,
    start_date: at(-2, 10, 0),
    end_date: at(-2, 11, 0),
    prevented_start_date: null,
    prevented_end_date: null,
    status_id: 5,
    client_accept_appointment: false,
    customer_id: client11.id,
    user_id: james.id,
    waiting_aprove: false,
    change_reason: null,
    created_by: demo.id,
    created_at: new Date('2026-08-01T09:00:00.000Z'),
    last_check: null,
    confirmation_sent: true,
    reminder_sent: true,
    reminder_time_id: 1,
    appointments_status: seedAppointmentStatuses[4],
    customers: { ...client11 },
    users: { ...james },
    creator: { ...demo },
  },
];

const seedLeadAppointmentMap: Record<number, any> = {
  [seedAppointments[0].id]: [
    { id: seedClientHasLead[0].id, note_id: null, client_id: client1.id, note_assigned: null },
  ],
  [seedAppointments[2].id]: [
    { id: seedClientHasLead[2].id, note_id: null, client_id: client3.id, note_assigned: null },
  ],
};

seedAppointments.forEach((appointment: any) => {
  appointment.task = [];
  appointment.lead_appointment = seedLeadAppointmentMap[appointment.id] || [];
});

const appointment4 = seedAppointments.find((appointment: any) => appointment.id === 4);
if (appointment4) {
  (appointment4 as any).prevented_start_date = at(2, 12, 0);
  (appointment4 as any).prevented_end_date = at(2, 13, 0);
  (appointment4 as any).waiting_aprove = true;
}
