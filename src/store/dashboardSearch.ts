import { DashboardSearchCustomers } from '@/app/libs/definitions';
import { create } from 'zustand';

export interface DashboardSearch {
  dashboardSearchCustomers: DashboardSearchCustomers;
  getDashboardSearchCustomers: (searchParam: string) => Promise<void>;
  customersList: boolean;
  openCustomersLists: () => void;
  closeCustomersLists: () => void;
}

export const dashboardSearchStore = create<DashboardSearch>((set) => ({
  dashboardSearchCustomers: undefined,
  getDashboardSearchCustomers: async (searchParam) => {
    const formData = new FormData();

    formData.append('param', searchParam);

    const data = await (
      await fetch('/api/dashboardSearch', { method: 'POST', body: formData })
    ).json();

    set({ dashboardSearchCustomers: data });
  },
  customersList: false,
  openCustomersLists: () => {
    set((state) => ({
      ...state,
      customersList: true,
    }));
  },
  closeCustomersLists: () => {
    set((state) => ({
      ...state,
      customersList: false,
    }));
  },
}));
