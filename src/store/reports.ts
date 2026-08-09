import {
  ActivitieRecord,
  BirthdayReport,
  SmsBulkReportData,
  SmsReportData,
} from '@/app/libs/definitions';
import { create } from 'zustand';

export interface DateToExternalFilter {
  optionDate?: string;
  valueDate?: string;
  fromDate?: string;
  toDate?: string;
}

interface StoreReports {
  birthdayReport: BirthdayReport;
  smsReport: SmsReportData;
  smsBulkReport: SmsBulkReportData[] | undefined;
  dateToExternalFilter: DateToExternalFilter | null;
  setDateToExternalFilter: (dateToExternalFilter: DateToExternalFilter | null) => void;
  getSmsReport: () => Promise<void>;
  getSmsBulkReport: () => Promise<SmsBulkReportData[] | undefined>;
  getBirthdayReport: () => Promise<void>;
}

export const storeReportsStore = create<StoreReports>((set) => ({
  birthdayReport: undefined,
  smsReport: undefined,
  smsBulkReport: undefined,
  dateToExternalFilter: { optionDate: '2' },
  getSmsReport: async () => {
    const data = await (await fetch('/api/reports/storeReport/smsReport')).json();

    set((state) => ({
      ...state,
      smsReport: data,
    }));
  },
  getSmsBulkReport: async () => {
    const data = await (await fetch('/api/reports/storeReport/bulkSms')).json();

    set((state) => ({
      ...state,
      smsBulkReport: data,
    }));
    return data;
  },
  getBirthdayReport: async () => {
    const data = await (await fetch('/api/reports/storeReport/birthdayReport')).json();

    set((state) => ({
      ...state,
      birthdayReport: data,
    }));
  },
  setDateToExternalFilter: (dateToExternalFilter) => {
    if (!dateToExternalFilter) {
      set(() => ({
        dateToExternalFilter: null,
      }));
      return;
    }
    set(() => ({
      dateToExternalFilter: dateToExternalFilter,
    }));
  },
}));

interface ReferrerStore {
  amount: string;
  referrerId: number | null;
  setReferrerId: (value: number | null) => void;
  setAmount: (value: string) => void;
}

export const referrerStore = create<ReferrerStore>((set) => ({
  amount: '',
  referrerId: null,
  setReferrerId: (value) => {
    set({ referrerId: value });
  },
  setAmount: (value) => {
    set({ amount: value });
  },
}));
