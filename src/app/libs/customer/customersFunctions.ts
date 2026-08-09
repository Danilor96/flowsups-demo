export function splitIncomingName(customerName: string) {
  const customerNameOrdered = { firstname: '', lastname: '' };

  const nameArray = customerName.split(' ');

  if (nameArray.length === 2) {
    customerNameOrdered.firstname = nameArray[0];
    customerNameOrdered.lastname = nameArray[1];
  } else if (nameArray.length === 3) {
    customerNameOrdered.firstname = `${nameArray[0]} ${nameArray[1]}`;
    customerNameOrdered.lastname = nameArray[2];
  } else if (nameArray.length >= 4) {
    customerNameOrdered.firstname = `${nameArray[0]} ${nameArray[1]}`;
    customerNameOrdered.lastname = nameArray.slice(2).join(' ');
  }

  return customerNameOrdered;
}

export const customerStatusName = [
  '',
  'New',
  'Contacted',
  'Credit App',
  'Delivery',
  'Undelivery',
  'Appointment',
  'Show Up',
  'No Show Up',
  'Deposit',
  'Sold',
  'Funding',
  'Lost',
  'Contact Attempt',
];

export enum CustomersStatuses {
  New = 1,
  Contacted = 2,
  CreditApp = 3,
  Delivery = 4,
  Undelivery = 5,
  Appointment = 6,
  Show = 7,
  NoShowUp = 8,
  Deposit = 9,
  Sold = 10,
  Funded = 11,
  Lost = 12,
  Contact_Attempt = 13,
}

export const CUSTOMER_STATUSES_LIST = [
  { id: CustomersStatuses.New, status: customerStatusName[CustomersStatuses.New] },
  { id: CustomersStatuses.Contact_Attempt, status: 'Contact Attempt' },
  { id: CustomersStatuses.Contacted, status: customerStatusName[CustomersStatuses.Contacted] },
  { id: CustomersStatuses.CreditApp, status: customerStatusName[CustomersStatuses.CreditApp] },
  { id: CustomersStatuses.Delivery, status: customerStatusName[CustomersStatuses.Delivery] },
  { id: CustomersStatuses.Undelivery, status: customerStatusName[CustomersStatuses.Undelivery] },
  { id: CustomersStatuses.Appointment, status: customerStatusName[CustomersStatuses.Appointment] },
  { id: CustomersStatuses.Show, status: customerStatusName[CustomersStatuses.Show] },
  { id: CustomersStatuses.NoShowUp, status: customerStatusName[CustomersStatuses.NoShowUp] },
  { id: CustomersStatuses.Deposit, status: customerStatusName[CustomersStatuses.Deposit] },
  { id: CustomersStatuses.Sold, status: customerStatusName[CustomersStatuses.Sold] },
  { id: CustomersStatuses.Funded, status: customerStatusName[CustomersStatuses.Funded] },
  { id: CustomersStatuses.Lost, status: customerStatusName[CustomersStatuses.Lost] },
];

export enum FundingStatuses {
  InProcess = 1,
  Funded = 2,
  Returned = 3,
}

export const filterNumber = (value: string) => {
  let valueFiltered = value?.replace(/\D/g, '');

  const valueFormated = valueFiltered?.length > 10 ? valueFiltered.slice(-10) : valueFiltered;

  return valueFormated;
};
