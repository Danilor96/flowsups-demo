export interface ComissionSalesRepSummary {
  salesConsultant: string;
  salesConsultantId: number;
  sales: number;
  comission: string;
  spiff: string;
  bonus: string;
  salary: string;
}

export interface ComissionBdcSummary {
  bdc: string;
  bdcId: number;
  sales: number;
  comission: string;
  spiff: string;
  bonus: string;
  salary: string;
}

export interface SalesSummary {
  customerName: string;
  customerId: number;
  stockNumber: string;
  vehicle: string;
  phoneNumber: string;
  dealDate: Date | null;
  dealStatus: string;
}

export interface AmountForm {
  id: number;
  amount: string;
  description: string;
}

export enum ComissionType {
  Spiff = 'spiff',
  Bonus = 'bonus',
  Salary = 'salary',
}
