import { create } from 'zustand';
import {
  AppliedFilter,
  CustomerReport,
  Datefilter,
  filter,
  ListViewTypes,
  SortConfig,
} from './types';

interface CustomerListState {
  filters: filter;
  sortConfig: SortConfig;
  advancedFilters: AppliedFilter[];
  viewType: ListViewTypes;
  currentCustomerReport: CustomerReport | null;
  columnsConfig: { id: string; label: string; checked: boolean }[];
  showSaveAsModal: boolean;
  showNewCustomerReportModal: boolean;
  showSendReportModal: boolean;
  showPermissionsModal: boolean;
  refreshCustomerReport: boolean;
  refreshCustomersList: boolean;
  fetchingData: boolean;
  doFetch: () => void;
  refreshCustomerReportToggle: () => void;
  updateFilters: (filters: Partial<filter>) => void;
  clearFilters: () => void;
  toggleSaveAsModal: () => void;
  toggleNewCustomerReportModal: () => void;
  toggleSendReportModal: () => void;
  openClosePermissionsModal: () => void;
  setSortConfig: (sortConfig: SortConfig) => void;
  setAdvancedFilters: (filters: AppliedFilter[]) => void;
  setViewType: (viewType: ListViewTypes) => void;
  applyCustomerReport: (customerReport: CustomerReport) => void;
  setCurrentCustomerReport: (customerReport: CustomerReport | null) => void;
}

const defaultDateFilter: Datefilter = {
  createdDate: '',
  fromDate: null,
  toDate: null,
  createdDateAlterInput: 0,
  defaultText: 'Created Date',
  previousUpcomingInputs: {
    optionSelectedValue: '',
    optionSelectedName: 'Select',
  },
};

export const initialFilterState: filter = {
  customerName: null,
  assignedToSellerId: null,
  assignedToSellerIds: null,
  assignedToBdcId: null,
  assignedToManagerId: null,
  assignedToFinanceManagerId: null,
  contactTimeId: 0,
  leadSource: null,
  leadSources: null,
  leadType: null,
  leadTypes: null,
  status: null,
  statusIds: null,
  leadTemperature: null,
  interestedVehicleId: null,
  interestedVehicle: null,
  dateFilter: {
    ...defaultDateFilter,
    defaultText: 'Create Date',
  },
  deliveryTime: {
    ...defaultDateFilter,
    defaultText: 'Delivery time',
  },
  daysIn: {
    ...defaultDateFilter,
    defaultText: 'Days in',
  },
  lastActivity: {
    ...defaultDateFilter,
    defaultText: 'Last Contacted Date',
  },
  visitDate: {
    ...defaultDateFilter,
    defaultText: 'Visit Date',
  },
  depositDate: {
    ...defaultDateFilter,
    defaultText: 'Deposit Date',
  },
  soldDate: {
    ...defaultDateFilter,
    defaultText: 'Sold Date',
  },
  lostDate: {
    ...defaultDateFilter,
    defaultText: 'Lost Date',
  },
  depositAmount: null,
  dealBank: null,
  lostReasonIds: null,
};

export const customerListStore = create<CustomerListState>((set) => ({
  filters: initialFilterState,
  showSaveAsModal: false,
  showNewCustomerReportModal: false,
  showPermissionsModal: false,
  sortConfig: { key: null, direction: 'ascending' },
  advancedFilters: [{ id: '0', field: '0', condition: '', value: null }],
  viewType: ListViewTypes.ListView,
  currentCustomerReport: null,
  refreshCustomerReport: false,
  refreshCustomersList: false,
  columnsConfig: [],
  showSendReportModal: false,
  fetchingData: false,
  doFetch: () => {
    set((state) => ({
      fetchingData: !state.fetchingData,
    }));
  },
  refreshCustomerReportToggle: () =>
    set((state) => ({ refreshCustomerReport: !state.refreshCustomerReport })),
  updateFilters: (filters: Partial<filter>) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  clearFilters: () => set({ filters: initialFilterState }),
  toggleSaveAsModal: () => set((state) => ({ showSaveAsModal: !state.showSaveAsModal })),
  toggleNewCustomerReportModal: () =>
    set((state) => ({ showNewCustomerReportModal: !state.showNewCustomerReportModal })),
  toggleSendReportModal: () =>
    set((state) => ({ showSendReportModal: !state.showSendReportModal })),
  openClosePermissionsModal: () =>
    set((state) => ({ showPermissionsModal: !state.showPermissionsModal })),
  setSortConfig: (sortConfig: SortConfig) => set({ sortConfig }),
  setAdvancedFilters: (filters: AppliedFilter[]) => set({ advancedFilters: filters }),
  setViewType: (viewType: ListViewTypes) => set({ viewType }),
  setCurrentCustomerReport: (customerReport: CustomerReport | null) =>
    set({ currentCustomerReport: customerReport }),
  applyCustomerReport: (customerReport: CustomerReport) => {
    const customerReportObject = {
      filters: JSON.parse(customerReport.filters as unknown as string) as filter,
      advancedFilters: JSON.parse(
        customerReport.advanced_filters as unknown as string,
      ) as AppliedFilter[],
      sortConfig: JSON.parse(customerReport.sort_config as unknown as string) as SortConfig,
      viewType:
        customerReport.view_type === 'ListView' ? ListViewTypes.ListView : ListViewTypes.DetailView,
      columnsConfig: customerReport.columns_config,
    };
    return set((state) => ({
      filters: customerReportObject.filters,
      advancedFilters: customerReportObject.advancedFilters,
      sortConfig: customerReportObject.sortConfig,
      viewType: customerReportObject.viewType,
      columnsConfig: customerReportObject.columnsConfig,
      currentCustomerReport: {
        ...customerReport,
        ...customerReportObject,
      },
      refreshCustomersList: !state.refreshCustomersList,
    }));
  },
}));
