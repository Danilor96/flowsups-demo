const defaultDateFilter = {
  createdDate: '',
  fromDate: null,
  toDate: null,
  createdDateAlterInput: 0,
  defaultText: 'Created Date',
  previousUpcomingInputs: {
    optionSelectedValue: '',
    optionSelectedName: 'Select'
  }
};

const initialFilterState = {
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
    defaultText: 'Created Date'
  },
  deliveryTime: {
    ...defaultDateFilter,
    defaultText: 'Delivery time'
  },
  daysIn: {
    ...defaultDateFilter,
    defaultText: 'Days in'
  },
  lastActivity: {
    ...defaultDateFilter,
    defaultText: 'Last Contacted Date'
  },
  visitDate: {
    ...defaultDateFilter,
    defaultText: 'Visit Date'
  },
  depositDate: {
    ...defaultDateFilter,
    defaultText: 'Deposit Date'
  },
  depositAmount: null,
  dealBank: null
};

export const reportAllCustomer = {
  id: 0,
  name: 'All Customers',
  filters: JSON.stringify(initialFilterState),
  sort_config: JSON.stringify({ key: null, direction: 'ascending' }),
  advanced_filters: JSON.stringify([
    {
      id: '0',
      field: '0',
      condition: '',
      value: null
    }
  ]),
  view_type: 'ListView',
  created_at: '2025-05-29T17:45:32.900Z',
  favoriteBy: [],
  defaultBy: []
};
