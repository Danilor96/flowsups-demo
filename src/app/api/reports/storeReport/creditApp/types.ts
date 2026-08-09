export interface CustomerColumn {
  customerName: string;
  cellPhone: string;
  homePhone: string;
  email: string;
  city: string;
  state: string;
  zip: string;
  dateOfBirth: Date | null;
  customerId: number;
  statusId: number;
}

export interface VehicleColumn {
  vehicle: string;
  price: string;
  millage: string;
  daysInStock: number;
  vin: string;
  stockNumber: string;
  img?: string | null;
}

export interface TradeInVehicleColumn {
  vehicle: string;
  vin: string;
  millage: string;
  price: string;
}

export interface LeadInfoColumn {
  id: number;
  status: string;
  creditAppCompleted: string;
  salesRep: string;
  salesRepId: number;
  bdc: string;
  manager: string;
  source: string;
  type: string;
}

export interface CreditInfoColumn {
  bank: string;
  incomeType: string;
  ssnTin: string;
  cashDown: string;
}

export interface DateColumn {
  createdAt: Date;
  salesRep: string;
  daysOld: number;
  lastContactedDay: Date | null;
}

export interface EmploymentColumn {
  employerName: string;
  occupation: string;
  lengthAtJob: string;
  income: string;
  workPhone: string;
}

export interface CreditAppReportSummary {
  customer: CustomerColumn;
  interestedVehicle?: VehicleColumn;
  tradeInVehicle?: TradeInVehicleColumn;
  leadInfo: LeadInfoColumn;
  creditAppInfo: CreditInfoColumn;
  date: DateColumn;
  employment: EmploymentColumn;
}

export interface TemporalCreditAppReportSummary {
  customer?: CustomerColumn;
  interestedVehicle?: VehicleColumn;
  tradeInVehicle?: TradeInVehicleColumn;
  leadInfo?: LeadInfoColumn;
  creditAppInfo?: CreditInfoColumn;
  date?: DateColumn;
  employment?: EmploymentColumn;
}
