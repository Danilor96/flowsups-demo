export const seedCustomerReports = [
  {
    id: 1,
    name: 'Recent Leads',
    owner_user_id: 1,
    filters: JSON.stringify({
      status: 'New Lead',
      leadSource: null,
      createdDate: '',
    }),
    sort_config: JSON.stringify({ key: 'created_at', direction: 'descending' }),
    advanced_filters: JSON.stringify([
      {
        id: '1',
        field: '1',
        condition: 'contains',
        value: null,
      },
    ]),
    columns_config: [
      { id: 'customerName', label: 'Customer', checked: true },
      { id: 'status', label: 'Status', checked: true },
    ],
    view_type: 'ListView',
    for_company: false,
    created_at: new Date('2026-07-25T15:00:00.000Z'),
    favoriteBy: [],
    defaultBy: [],
    permissions: [{ userId: 2 }, { userId: 3 }],
  },
  {
    id: 2,
    name: 'Approved Credit Apps',
    owner_user_id: 2,
    filters: JSON.stringify({
      statusIds: [4],
      dateFilter: { fromDate: null, toDate: null },
    }),
    sort_config: JSON.stringify({ key: 'credit_app_created_at', direction: 'ascending' }),
    advanced_filters: JSON.stringify([]),
    columns_config: null,
    view_type: 'DetailView',
    for_company: true,
    created_at: new Date('2026-08-02T09:30:00.000Z'),
    favoriteBy: [{ id: 1 }],
    defaultBy: [{ id: 1 }],
    permissions: [],
  },
];