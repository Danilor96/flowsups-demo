import { Clients, ClientType } from '@/app/libs/definitions';
import { customerListStore } from '@/store/customerList/customerList.store';
import { useCallback, useState } from 'react';

type SortDirection = 'ascending' | 'descending';

export type SortableClientKey =
  | 'name_lastname'
  | 'email'
  | 'created_at'
  | 'born_date'
  | 'last_activity'
  | 'client_status' 
  | 'lead_source' 
  | 'seller';

export interface SortConfig {
  key: SortableClientKey | null;
  direction: SortDirection;
}

export interface SortOption {
  value: SortableClientKey;
  label: string;
}

export const useSortTable = () => {
  // const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'ascending' });
  const sortConfig = customerListStore((state) => state.sortConfig);
  const setSortConfig = customerListStore((state) => state.setSortConfig);
  
  const [showSortOptions, setShowSortOptions] = useState(false);

  const sortOptions: SortOption[] = [
    { value: 'name_lastname', label: 'Customer Name' },
    { value: 'email', label: 'Email' },
    { value: 'created_at', label: 'Created Date' },
    { value: 'born_date', label: 'Date of Birth' },
    // { value: 'last_activity', label: 'Last Activity' },
    { value: 'client_status', label: 'Customer Status' },
    { value: 'lead_source', label: 'Lead Source' },
    { value: 'seller', label: 'Assigned Seller' }
  ];

  const compareValues = useCallback((a: any, b: any, direction: SortDirection): number => {
    if (a === null || a === undefined) return direction === 'ascending' ? 1 : -1;
    if (b === null || b === undefined) return direction === 'ascending' ? -1 : 1;

    if (a instanceof Date && b instanceof Date) {
      return direction === 'ascending' ? a.getTime() - b.getTime() : b.getTime() - a.getTime();
    }
    if (typeof a === 'number' && typeof b === 'number') {
      return direction === 'ascending' ? a - b : b - a;
    }
    if (typeof a === 'string' && typeof b === 'string') {
      const valA = a.toLowerCase();
      const valB = b.toLowerCase();
      if (valA < valB) return direction === 'ascending' ? -1 : 1;
      if (valA > valB) return direction === 'ascending' ? 1 : -1;
      return 0;
    }
    return 0;
  }, []);

  const sortClients = (clients: Clients) => {
    if (!clients || clients.length === 0) {
      return [];
    }
    if (!sortConfig.key) {
      return clients;
    }
    const sortableItems = [...clients];
    sortableItems.sort((a, b) => {
      let aValue: any;
      let bValue: any;
      const key = sortConfig.key!;

      switch (key) {
        case 'client_status':
          aValue = a.client_status?.status;
          bValue = b.client_status?.status;
          break;
        case 'lead_source':
          aValue = a.lead_source?.source;
          bValue = b.lead_source?.source;
          break;
        case 'seller':
          aValue = a.seller ? `${a.seller.name || ''} ${a.seller.last_name || ''}`.trim() : null;
          bValue = b.seller ? `${b.seller.name || ''} ${b.seller.last_name || ''}`.trim() : null;
          break;
        default:
          aValue = a[key as keyof ClientType];
          bValue = b[key as keyof ClientType]; 
          break;
      }
      return compareValues(aValue, bValue, sortConfig.direction);
    });
    return sortableItems;
  };

  const requestSort = useCallback(
    (key: SortableClientKey) => {
      let direction: SortDirection = 'ascending';
      if (sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
      }
      setSortConfig({ key, direction });
      setShowSortOptions(false);
    },
    [sortConfig]
  );

  const getSortDirectionLabel = (key: SortableClientKey | null) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' (Asc)' : ' (Desc)';
    }
    return '';
  };


  const displayColumns: {
    headerLabel: string;
    sortKey: SortableClientKey;
    dataAccessor: (client: ClientType) => React.ReactNode;
  }[] = [
    { headerLabel: 'Nombre Cliente', sortKey: 'name_lastname', dataAccessor: client => client.name_lastname || 'N/A' },
    { headerLabel: 'Email', sortKey: 'email', dataAccessor: client => client.email },
    {
      headerLabel: 'Fecha Creación',
      sortKey: 'created_at',
      dataAccessor: client => client.created_at.toLocaleDateString()
    },
    {
      headerLabel: 'Estatus Cliente',
      sortKey: 'client_status',
      dataAccessor: client => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${
            client.client_status?.status === 'Active'
              ? 'bg-green-100 text-green-800'
              : client.client_status?.status === 'Inactive'
              ? 'bg-red-100 text-red-800'
              : client.client_status?.status === 'Pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {client.client_status?.status || 'N/A'}
        </span>
      )
    },
    { headerLabel: 'Origen Lead', sortKey: 'lead_source', dataAccessor: client => client.lead_source?.source || 'N/A' },
    {
      headerLabel: 'Vendedor',
      sortKey: 'seller',
      dataAccessor: client =>
        client.seller ? `${client.seller.name || ''} ${client.seller.last_name || ''}`.trim() || 'N/A' : 'N/A'
    },
    {
      headerLabel: 'Última Actividad',
      sortKey: 'last_activity',
      dataAccessor: client => (client.last_activity ? client.last_activity.toLocaleDateString() : 'N/A')
    }
  ];

  return {
    sortClients,
    requestSort,
    getSortDirectionLabel,
    setShowSortOptions,
    showSortOptions,
    sortConfig,
    sortOptions,
    setSortConfig
  };
};
