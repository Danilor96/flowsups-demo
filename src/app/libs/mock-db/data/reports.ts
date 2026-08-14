import { seedUsers } from './users';
import { seedLeads } from './leads';
import { seedClients } from './clients';
import { seedVehicles } from './vehicles';
import { seedNotes } from './conversations';
import { Decimal } from '../decimal';

const seller = seedUsers[1];
const seller2 = seedUsers[2];
const bdc = seedUsers[5];
const demo = seedUsers[0];

export const seedSalesGoalsConfig = [
  {
    id: 1,
    business_id: 1,
    monthlySalesGoal: 30,
    dailySalesPointsTarget: 10,
    emailsSentNumber: 10,
    smssSentNumber: 10,
    callsMadeNumber: 10,
    appointmentsCompletedNumber: 5,
    appointmentsMadeNumber: 5,
    soldCustomersNumber: 3,
  },
];

export const seedSalesActivityLog = [
  { id: 1, user_id: seller.id, activity_type: 'EMAIL_SENT', created_at: new Date('2026-08-04T10:00:00.000Z') },
  { id: 2, user_id: seller2.id, activity_type: 'CUSTOMER_SOLD', created_at: new Date('2026-08-05T11:00:00.000Z') },
  { id: 3, user_id: seller.id, activity_type: 'CUSTOMER_SOLD', created_at: new Date('2026-08-06T09:00:00.000Z') },
];

export const seedComissionInfo = [
  {
    id: 1,
    user_id: seller.id,
    bonus: [
      { id: 1, amount: Decimal(500), description: 'Monthly bonus', comission_info_id: 1 },
    ],
    salary: [
      { id: 1, amount: Decimal(1500), description: 'Base salary', comission_info_id: 1 },
    ],
    spiff: [
      { id: 1, amount: Decimal(200), description: 'Spiff', comission_info_id: 1 },
    ],
  },
  {
    id: 2,
    user_id: seller2.id,
    bonus: [
      { id: 2, amount: Decimal(300), description: 'Monthly bonus', comission_info_id: 2 },
    ],
    salary: [
      { id: 2, amount: Decimal(1500), description: 'Base salary', comission_info_id: 2 },
    ],
    spiff: [
      { id: 2, amount: Decimal(100), description: 'Spiff', comission_info_id: 2 },
    ],
  },
];

export const seedComissionSpiff = [
  { id: 1, amount: Decimal(200), description: 'Spiff', comission_info_id: 1 },
  { id: 2, amount: Decimal(100), description: 'Spiff', comission_info_id: 2 },
];

export const seedComissionBonus = [
  { id: 1, amount: Decimal(500), description: 'Monthly bonus', comission_info_id: 1 },
  { id: 2, amount: Decimal(300), description: 'Monthly bonus', comission_info_id: 2 },
];

export const seedComissionSalary = [
  { id: 1, amount: Decimal(1500), description: 'Base salary', comission_info_id: 1 },
  { id: 2, amount: Decimal(1500), description: 'Base salary', comission_info_id: 2 },
];

export const seedClientsHasReferrer = [
  {
    id: 1,
    client_buyer_id: 6,
    client_referrer_id: 7,
    amount: '500',
    created_at: new Date('2026-08-05T00:00:00.000Z'),
    created_by: bdc.id,
  },
];

export const seedDealReceipts = [
  {
    id: 1,
    receiptNumber: 'RCPT-0001',
    amount: '5000',
    date: new Date('2026-08-02T00:00:00.000Z'),
    dealId: 1,
    paymentDateId: 1,
  },
];

export const seedDailyVisitHistory = [
  {
    id: 1,
    customer_id: 6,
    sales_rep_id: seller2.id,
    vehicle_id: 8,
    decision_id: 2,
    note_id: 1,
    created_at: new Date('2026-08-05T14:00:00.000Z'),
    sales_rep: {
      id: seller2.id,
      name: seller2.name,
      last_name: seller2.last_name,
      username: seller2.username,
    },
    vehicle: {
      ...seedVehicles[7],
    },
    note: { note: 'Customer liked the truck, requested a test drive next week.' },
  },
];

export const seedMonthlyGoals = [
  {
    id: 1,
    sales_goal: Decimal(10),
    date_month: new Date('2026-08-01T00:00:00.000Z'),
    created_at: new Date('2026-08-01T00:00:00.000Z'),
    business_id: 1,
    user_id: seller.id,
  },
];