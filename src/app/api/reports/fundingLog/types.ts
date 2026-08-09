export interface FundingLogSummary {
  fundingDate: Date | null;
  customerName: string;
  phoneNumber: string;
  vehicle: string;
  salesRep: string;
  managerRep: string;
  lender: string;
  loanId: string;
  fundingStatus: number | null;
  downPayment: string;
  paid: string;
  bonus: string;
  customerId: number;
  dealId: number;
  salesId: number;
  managerId: number;
  vehicleId: number;
  leadId: number;
  deferredDownpayment: string;
  cobuyerId?: number | null;
  cobuyerName?: string | null;
  isSplitSold?: boolean;
  sellersInSplitDeal?: {
    id: number;
    name: string | null;
    last_name: string | null;
  }[];
}

export interface FundingLogStatisticsSummary {
  salesRep: string;
  pending: number;
  funded: number;
  returned: number;
  total: number;
}
