export interface SalesConversionSummary {
  assignedRepId: number;
  assignedRep: string;
  totalLead: number;
  new: number;
  contacted: number;
  creditApp: number;
  delivery: number;
  undelivered: number;
  appointment: number;
  showUp: number;
  noShowUp: number;
  deposit: number;
  sold: number;
  funding: number;
  lost: number;
}

export interface SalesConversionCustomersDetail {
  id: number;
  customer: string;
  phoneNumber: string;
  homePhone: string;
  email: string;
  source: string;
  dateOfBirth: Date | null;
  total: number;
}

export interface SalesConversionSummaryColsTotal {
  totalColLeads: number;
  totalColNew: number;
  totalColContacted: number;
  totalColCreditApp: number;
  totalColDelivery: number;
  totalColUndelivered: number;
  totalColAppointment: number;
  totalColShowUp: number;
  totalColNoShowUp: number;
  totalColDeposit: number;
  totalColSold: number;
  totalColFunding: number;
  totalColLost: number;
}
