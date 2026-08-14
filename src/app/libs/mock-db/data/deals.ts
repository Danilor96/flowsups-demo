import { seedClients } from './clients';
import { seedLeads } from './leads';
import { seedUsers } from './users';
import { seedVehicles } from './vehicles';
import { Decimal } from '../decimal';

const lead6 = seedLeads[5];
const lead10 = seedLeads[9];
const client6 = seedClients[5];
const client10 = seedClients[9];
const seller3 = seedUsers[6];
const seller1 = seedUsers[1];
const bank1 = { id: 1, bank: 'Chase Auto Finance' };
const bank2 = { id: 2, bank: 'Capital One Auto Finance' };

export const seedBanks = [
  { id: 1, bank: 'Chase Auto Finance' },
  { id: 2, bank: 'Capital One Auto Finance' },
  { id: 3, bank: 'TD Auto Finance' },
  { id: 4, bank: 'Ally Financial' },
  { id: 5, bank: 'Santander Consumer USA' },
  { id: 6, bank: 'Credit Acceptance' },
  { id: 7, bank: 'DriveTime Financial' },
  { id: 8, bank: 'Bank of America Auto' },
];

export const seedDeals: any[] = [
  {
    id: 1,
    seller_id: seller3.id,
    created_at: new Date('2026-08-01T18:00:00.000Z'),
    loan_id: 'LOAN-2026-0001',
    frontend: Decimal(2000),
    backend: Decimal(1500),
    bonus: Decimal(1000),
    downpayment: Decimal(12000),
    paid: Decimal(5000),
    moneyDuePaid: Decimal(0),
    deferredDownpayment: Decimal(3000),
    customer: {
      ...client6,
      lead_source: client6.lead_source,
      funding_list_status: null,
      funding_list_status_id: null,
      interested_vehicle: client6.interested_vehicle,
      seller: client6.seller,
      sales_manager: client6.sales_manager || null,
      finance_manager: client6.finance_manager || null,
    },
    lead: {
      ...lead6,
      customer_funding_list_status_id: 2,
      customer_funding_returned_at: null,
      vehicle: lead6.clients.interested_vehicle || seedVehicles[7],
      sellersInSplitDeal: [],
    },
    bank: { ...bank1 },
    seller: { ...seller3 },
    paymentDate: [
      {
        id: 1,
        date: new Date('2026-08-15T00:00:00.000Z'),
        dealId: 1,
        amountPerDate: [
          { id: 1, amount: '3000', paid: false, paymentDateId: 1 },
          { id: 2, amount: '3000', paid: false, paymentDateId: 1 },
        ],
      },
    ],
  },
  {
    id: 2,
    seller_id: seller1.id,
    created_at: new Date('2026-07-20T14:00:00.000Z'),
    loan_id: 'LOAN-2026-0002',
    frontend: Decimal(1800),
    backend: Decimal(1200),
    bonus: Decimal(2000),
    downpayment: Decimal(20000),
    paid: Decimal(15000),
    moneyDuePaid: Decimal(5000),
    deferredDownpayment: Decimal(0),
    customer: {
      ...client10,
      lead_source: client10.lead_source,
      funding_list_status: null,
      funding_list_status_id: null,
      interested_vehicle: null,
      seller: client10.seller,
      sales_manager: client10.sales_manager || null,
      finance_manager: client10.finance_manager || null,
    },
    lead: {
      ...lead10,
      customer_funding_list_status_id: 2,
      customer_funding_returned_at: null,
      vehicle: null,
      sellersInSplitDeal: [],
    },
    bank: { ...bank2 },
    seller: { ...seller1 },
    paymentDate: [],
  },
];

export const seedPaymentDates: any[] = [
  {
    id: 1,
    date: new Date('2026-08-15T00:00:00.000Z'),
    dealId: 1,
    amountPerDate: [
      { id: 1, amount: '3000', paid: false, paymentDateId: 1 },
      { id: 2, amount: '3000', paid: false, paymentDateId: 1 },
    ],
  },
];

export const seedAmountPerDates: any[] = [
  { id: 1, amount: '3000', paid: false, paymentDateId: 1 },
  { id: 2, amount: '3000', paid: false, paymentDateId: 1 },
];

export const seedChargesBack = [
  {
    id: 1,
    description: 'Marketing fee adjustment',
    amount: Decimal(250),
    created_at: new Date('2026-08-03T00:00:00.000Z'),
    business_id: 1,
  },
];

export const seedOtherSalesLog = [
  {
    id: 1,
    customerFirstName: 'Hector',
    customerLastName: 'Ramirez',
    customerMobile: '3055554455',
    created_at: new Date('2026-08-04T00:00:00.000Z'),
    date: new Date('2026-08-04T00:00:00.000Z'),
    assigned_seller_id: seller1.id,
    vehicle_id: 1,
    assigned_seller: {
      id: seller1.id,
      name: seller1.name,
      last_name: seller1.last_name,
    },
    vehicle: {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      year: '2025',
      stock_no: 'STK-1001',
      vin: '1HGCM82633A004352',
    },
  },
];

export const seedOtherVehicle = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    year: '2025',
    stock_no: 'STK-1001',
    vin: '1HGCM82633A004352',
  },
];

export const seedMarketingCost = [
  {
    id: 1,
    amount: Decimal(500),
    created_at: new Date('2026-08-02T00:00:00.000Z'),
    business_id: 1,
    source_id: 1,
  },
  {
    id: 2,
    amount: Decimal(300),
    created_at: new Date('2026-08-02T00:00:00.000Z'),
    business_id: 1,
    source_id: 3,
  },
];