export interface BdcLogSummary {
  customerName: string;
  customerId: number;
  soldFundingDate: Date | null;
  salesRep: string | null;
  salesRepId: number | null;
  bdcRep: string | null;
  bdcRepId: number | null;
  managerRep: string | null;
  managerRepId: number | null;
  leadId: number;
}

export interface BdcLogStatisticsSummary {
  bdc: string;
  sold: number;
  other: number;
  rts: number;
  total: number;
}

export enum DefaultRoles {
  Superuser = 1,
  Administrator = 2,
  SalesManager = 3,
  FinanceManager = 4,
  Bdc = 5,
  SalesRep = 6,
}
