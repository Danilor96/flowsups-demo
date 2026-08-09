export interface ReferrerSummary {
  referrerDataId: number;
  customerName: string;
  customerId: number;
  mobilePhone: string;
  salesRep: string;
  contacted: boolean;
  address: string;
  amount: string;
  stockNumber?: string;
  newCustomerName: string;
  newCustomerNameId: number;
  date: Date;
  fee: string;
  fundingStatus: string;
}

export interface RefScoreSummary {
  referralName: string;
  customerSold: number;
  customerName: string;
  customerId: number;
  stockNumber: string | null;
  vehicle: string;
  vehicleId: number | null;
  phoneNumber: string;
  salesAssigned: string;
  bdcAssigned: string;
}
