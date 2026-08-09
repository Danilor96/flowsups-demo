import { create } from 'zustand';
import { numberFormatterStore } from './adminDashboard';

interface DealStore {
  dealIdSelected: number | null;
  setDealId: (id: number | null) => void;
  leadId: number | null;
  setLeadId: (id: number | null) => void;
  dealData: {
    bonus: string;
    paid: string;
    downPayment: string;
    lender: string;
    loanId: string;
    status: string;
    customerId: string;
  };
  setDealData: (name: string, value: string, identity?: string | null) => void;
  resetDealData: () => void;
}

const defaultDealData = {
  bonus: '',
  paid: '',
  downPayment: '',
  lender: '',
  loanId: '',
  status: '',
  customerId: '',
};

export const dealStore = create<DealStore>((set, get) => ({
  dealIdSelected: null,
  leadId: null,
  setDealId: (id) => {
    set({ dealIdSelected: id });
  },
  setLeadId: (id) => {
    set({ leadId: id });
  },
  dealData: defaultDealData,
  setDealData: (name, value, identity) => {
    const { dealData } = get();
    const { numberFilter } = numberFormatterStore.getState();

    const numberInputs = ['bonus', 'paid', 'downPayment'];

    const key = name as keyof typeof dealData;

    set((prevState) => {
      let newState = { ...prevState };

      newState.dealData = { ...prevState.dealData };

      if (numberInputs.includes(key)) {
        const numberValue = numberFilter(value);

        newState.dealData[key] = numberValue;

        return newState;
      }

      if (key === 'status') {
        newState.dealData.customerId = value ? (identity ? identity : '') : '';
      }

      newState.dealData[key] = value;

      return newState;
    });
  },
  resetDealData: () => {
    set({ dealData: defaultDealData });
  },
}));
