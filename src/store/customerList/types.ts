export interface Datefilter {
  createdDate?: string | null;
  fromDate?: Date | null;
  toDate?: Date | null;
  createdDateAlterInput?: number | null;
  defaultText: string;
  previousUpcomingInputs: {
    optionSelectedValue: string;
    optionSelectedName: string;
  };
}

interface AmountFilterCriteria {
  condition: '>' | '<' | '=' | '>=' | '<=' | '!=';
  value: string;
}

export interface filter {
  customerName: string | undefined | null;
  assignedToSellerId?: string | null;
  assignedToSellerIds?: number[] | null;
  assignedToBdcId?: string | null;
  assignedToBdcIds?: number[] | null;
  assignedToManagerId?: string | null;
  assignedToManagerIds?: number[] | null;
  assignedToFinanceManagerId?: string | null;
  assignedToFinanceManagerIds?: number[] | null;
  contactTimeId: number;
  leadSource?: number | null;
  leadSources?: number[] | null;
  leadType?: number | null;
  leadTypes?: number[] | null;
  status?: number | null;
  statusIds?: number[] | null;
  leadTemperature?: number | null;
  interestedVehicleId?: number | null;
  interestedVehicle?: string | null;
  dateFilter: Datefilter;
  deliveryTime: Datefilter;
  daysIn: Datefilter;
  lostDate: Datefilter;
  soldDate: Datefilter;
  lastActivity: Datefilter;
  visitDate: Datefilter;
  depositDate: Datefilter;
  depositAmount?: AmountFilterCriteria | null;
  dealBank: string | undefined | null;
  lostReasonIds?: number[] | null;
}

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

export type FilterValue =
  | string
  | number
  | Date
  | boolean
  | null
  | [Date | null, Date | null]
  | [number | null, number | null];

export type FilterableFieldType = 'text' | 'number' | 'date' | 'boolean' | 'select';

export interface FilterableField {
  id: string;
  label: string;
  type: FilterableFieldType;
  options?: { value: string; label: string }[];
}

// Condiciones de filtro
export type FilterCondition =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'doesNotContain'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'between'
  | 'isTrue'
  | 'isFalse'
  | 'is'
  | 'isNot';

export interface AppliedFilter {
  id: string;
  field: FilterableField['id'] | '';
  condition: FilterCondition | '';
  value: FilterValue;
  value2?: FilterValue;
}

export const enum ListViewTypes {
  Default,
  DetailView,
  ListView,
}

export interface CustomerReport {
  id: number;
  name: string;
  owner_user_id: number;
  filters: filter;
  sort_config: SortConfig;
  advanced_filters: AppliedFilter[];
  view_type: string;
  for_company: boolean;
  favoriteBy: { id: number }[];
  defaultBy: { id: number }[];
  columns_config: { id: string; label: string; checked: boolean }[];
  permissions: { userId: number }[];
}
