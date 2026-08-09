import { create } from 'zustand';
import { Datefilter } from './customerList/types';

interface SortConfig {
  key: string | null;
  direction: 'ascending' | 'descending' | null;
}

interface FilterInitialState {
  createDate: Datefilter;
  dueDate: Datefilter;
  soldDate: Datefilter;
  assignedToSellerIds?: number[] | null;
  secondAssignedToSellerIds?: number[] | null;
  customerName?: string | null;
  taskStatusIds?: number[] | null;
  advancedFilters?: AppliedFilter[] | null;
  sortConfig?: SortConfig;
  leadSourcesIds?: number[] | null;
  customerStatusIds?: number[] | null;
  leadActivityTypeIds?: number[] | null;
  leadActivityStatusIds?: number[] | null;
}

const defaultDateFilter: Datefilter = {
  createdDate: '2',
  fromDate: null,
  toDate: null,
  createdDateAlterInput: 0,
  defaultText: 'Today',
  previousUpcomingInputs: {
    optionSelectedValue: '',
    optionSelectedName: 'Select',
  },
};

const initialState: FilterInitialState = {
  createDate: defaultDateFilter,
  dueDate: defaultDateFilter,
  soldDate: defaultDateFilter,
  assignedToSellerIds: null,
  secondAssignedToSellerIds: null,
  customerName: null,
  taskStatusIds: null,
  // leadSources: null,
  advancedFilters: null,
  sortConfig: { key: null, direction: null },
  leadSourcesIds: null,
  customerStatusIds: null,
  leadActivityTypeIds: null,
  leadActivityStatusIds: null,
};

interface FilterMapper {
  salesRep?: string | null;
  secondSalesRep?: string | null;
  customerFullName?: string | null;
  customerFirstName?: string | null;
  customerLastName?: string | null;
  customerMobilePhone?: string | null;
  taskStatus?: string | null;
  leadSource?: string | null;
  customerStatus?: string | null;
  leadActivityType?: string | null;
  leadActivityStatus?: string | null;
}

interface FilterControl {
  updateFilter: (filter: Partial<FilterInitialState>) => void;
  clearFilters: () => void;
  applyFilter: <T>(data: T[], filterMapper?: FilterMapper) => T[];
  updateAdvancedFilters: (filters: AppliedFilter[]) => void;
  sortHandler: (key: string) => void;
  clearSort: () => void;
}

export const reportsFiltersStore = create<FilterInitialState & FilterControl>((set, get) => ({
  ...initialState,
  updateFilter: (filter) => {
    set(filter);
  },
  clearFilters: () => {
    set(initialState);
  },
  applyFilter: (data, filterMapper) => {
    const {
      assignedToSellerIds,
      customerName,
      taskStatusIds,
      advancedFilters,
      sortConfig,
      leadSourcesIds,
      customerStatusIds,
      leadActivityTypeIds,
      leadActivityStatusIds,
      secondAssignedToSellerIds,
    } = get();
    let newArray = data;

    if (advancedFilters && advancedFilters.length > 0 && newArray) {
      newArray = advancedFilters.reduce((currentData, filter) => {
        if (!filter.field || !filter.condition) return currentData;

        return executeFilter(currentData, filter);
      }, newArray);
    }

    if (assignedToSellerIds && assignedToSellerIds.length > 0 && newArray) {
      newArray = newArray.filter((el) => {
        const property = filterMapper?.salesRep;
        const value = getNestedValue(el, property || '');

        return assignedToSellerIds?.includes(value || 0);
      });
    }

    if (secondAssignedToSellerIds && secondAssignedToSellerIds.length > 0 && newArray) {
      newArray = newArray.filter((el) => {
        const property = filterMapper?.secondSalesRep;
        const value = getNestedValue(el, property || '');

        return secondAssignedToSellerIds?.includes(value || 0);
      });
    }

    if (taskStatusIds && taskStatusIds.length > 0 && newArray) {
      newArray = newArray.filter((el) => {
        const property = filterMapper?.taskStatus;
        const value = getNestedValue(el, property || '');

        return taskStatusIds?.includes(value || 0);
      });
    }

    if (customerName && newArray) {
      const customerNamesFilter = customerName.toLowerCase().split(' ');
      newArray = newArray.filter((customer) => {
        const propertyFullName = filterMapper?.customerFullName;
        const propertyFirstName = filterMapper?.customerFirstName;
        const propertyLastName = filterMapper?.customerLastName;
        const propertyMobilePhone = filterMapper?.customerMobilePhone;
        const valueFullName = getNestedValue(customer, propertyFullName || '');
        const valueFirstName = getNestedValue(customer, propertyFirstName || '');
        const valueLastName = getNestedValue(customer, propertyLastName || '');
        const valueMobilePhone = getNestedValue(customer, propertyMobilePhone || '');

        const clientName = valueFullName
          ? valueFullName.toLowerCase()
          : `${valueFirstName} ${valueLastName}`.toLowerCase();
        const phoneNumber = valueMobilePhone?.replace(/-/g, '').toLowerCase();

        return customerNamesFilter.every(
          (word) => clientName.includes(word) || phoneNumber?.includes(word.replace(/-/g, '')),
        );
      });
    }

    if (leadSourcesIds && leadSourcesIds.length > 0 && data) {
      newArray = newArray.filter((el) => {
        const property = filterMapper?.leadSource;
        const value = getNestedValue(el, property || '');

        return leadSourcesIds?.includes(value || 0);
      });
    }

    if (customerStatusIds && customerStatusIds.length > 0 && data) {
      newArray = newArray.filter((el) => {
        const property = filterMapper?.customerStatus;
        const value = getNestedValue(el, property || '');

        return customerStatusIds?.includes(value || 0);
      });
    }

    if (leadActivityTypeIds && leadActivityTypeIds.length > 0 && data) {
      newArray = newArray.filter((el) => {
        const property = filterMapper?.leadActivityType;
        const value = getNestedValue(el, property || '');

        return leadActivityTypeIds?.includes(value || 0);
      });
    }

    if (leadActivityStatusIds && leadActivityStatusIds.length > 0 && data) {
      newArray = newArray.filter((el) => {
        const property = filterMapper?.leadActivityStatus;
        const value = getNestedValue(el, property || '');

        return leadActivityStatusIds?.includes(value || 0);
      });
    }

    if (sortConfig?.key) {
      newArray = getSortedData(newArray, sortConfig);
    }

    return newArray;
  },
  updateAdvancedFilters: (filters: AppliedFilter[]) => {
    set({ advancedFilters: filters });
  },
  sortHandler: (key: string) => {
    const currentSortConfig = get().sortConfig;
    let direction: SortConfig['direction'] = 'ascending';

    if (currentSortConfig?.key === key && currentSortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (currentSortConfig?.key === key && currentSortConfig.direction === 'descending') {
      return get().clearSort();
    }

    const newConfig: SortConfig = { key, direction };
    set({ sortConfig: newConfig });
  },
  clearSort: () => {
    const emptyConfig: SortConfig = { key: null, direction: null };
    set({ sortConfig: emptyConfig });
  },
}));

interface ResultQuery {
  optionDate?: string;
  valueDate?: string;
  fromDate?: string;
  toDate?: string;
}

export const transformDateToQuery = (date: Datefilter): ResultQuery | null => {
  let result: ResultQuery | null = {};

  switch (date.createdDate) {
    // today
    case '2':
      result = { optionDate: '2' };
      break;

    // tomorrow
    case '3':
      result = { optionDate: '3' };
      break;

    // yesterday
    case '12':
      result = { optionDate: '12' };
      break;

    // between
    case '13':
      result = {
        optionDate: '13',
        fromDate: date.fromDate?.toISOString(),
        toDate: date.toDate?.toISOString(),
      };
      break;

    // previous
    case '4':
      // previous span
      result = {
        optionDate: '4',
        valueDate: date.previousUpcomingInputs.optionSelectedValue,
      };
      break;

    // upcoming
    case '5':
      // upcoming span
      result = {
        optionDate: '5',
        valueDate: date.previousUpcomingInputs.optionSelectedValue,
      };
      break;

    // first quarter
    case '6':
      result = { optionDate: '6' };
      break;

    // second quarter
    case '7':
      result = { optionDate: '7' };
      break;

    // third quarter
    case '8':
      result = { optionDate: '8' };
      break;

    // fourth quarter
    case '9':
      result = { optionDate: '9' };
      break;

    // last x days
    case '10':
      result = { optionDate: '10', valueDate: date.createdDateAlterInput?.toString() };
      break;

    // last x months
    case '11':
      result = { optionDate: '11', valueDate: date.createdDateAlterInput?.toString() };
      break;

    default:
      result = null;
      break;
  }

  return result;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
};

// const executeFilter = <T extends Record<string, any>>(
const executeFilter = <T>(dataArray: T[], filter: AppliedFilter): T[] => {
  if (!dataArray || dataArray.length === 0 || !filter.field || !filter.condition) {
    return dataArray;
  }

  const { field, condition, value, value2 } = filter;

  if (filter.value === null && filter.condition !== 'is' && filter.condition !== 'isNot')
    return dataArray;

  return dataArray.filter((item) => {
    const itemValue = getNestedValue(item, field);

    const isItemNullOrUndefined = itemValue === null || itemValue === undefined || itemValue === '';

    const targetValue = value;

    // --- Strings ---

    const stringValue = String(itemValue || '').toLowerCase();
    const targetString = String(targetValue ?? '').toLowerCase();

    switch (condition) {
      // --- Equality & Inequality ---
      case 'equals':
        return itemValue == targetValue;
      case 'notEquals':
        return itemValue != targetValue;

      // --- Strings ---
      case 'contains':
        return stringValue.includes(targetString);
      case 'doesNotContain':
        return !stringValue.includes(targetString);
      case 'startsWith':
        return stringValue.startsWith(targetString);
      case 'endsWith':
        return stringValue.endsWith(targetString);

      // --- Number/Date (Requiere Type Narrowing) ---
      case 'greaterThan':
      case 'lessThan':
      case 'greaterThanOrEqual':
      case 'lessThanOrEqual':
        if (targetValue === null || targetValue === undefined) return false;

        return itemValue > targetValue;

      case 'between':
        const min = value;
        const max = value2;

        if (min === null || min === undefined || max === null || max === undefined) {
          return false;
        }
        return itemValue >= min && itemValue <= max;

      // --- Booleans & Null ---
      case 'isTrue':
        return itemValue === true;
      case 'isFalse':
        return itemValue === false;
      case 'is':
        return isItemNullOrUndefined;
      case 'isNot':
        return !isItemNullOrUndefined;

      default:
        return true;
    }
  });
};

const getSortedData = (dataToSort: any[], config: SortConfig): any[] => {
  if (!config.key || !config.direction) {
    return dataToSort;
  }

  const sortableData = [...dataToSort];

  sortableData.sort((a, b) => {
    const aValue = getNestedValue(a, config.key!);
    const bValue = getNestedValue(b, config.key!);

    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;

    if (aValue < bValue) {
      return config.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return config.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  return sortableData;
};
