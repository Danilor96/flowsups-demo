'use client';

import { useState, useEffect, useMemo } from 'react';
import { AppliedFilter } from '@/store/customerList/types';
import { numberFormatterStore } from '@/store/adminDashboard';
import { timeSpansStore } from '@/store/dateFormats';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import { DateAndId } from '@/app/api/reports/storeReport/callActivity/route';
import { storeReportsStore } from '@/store/reports';

type InputFilter = {
  salesRep: string;
  customerName: string;
  createdDate: string;
};

interface ReportFilter {
  data: { [key: string]: any }[];
  accessorMap?: { [key: string]: string };
}

interface SortConfig {
  key: string | null;
  direction: 'ascending' | 'descending' | null;
}

const inputsInitialState = {
  salesRep: '',
  customerName: '',
};

export function useReportAndFilter({ data, accessorMap }: ReportFilter) {
  const [filteredData, setFilteredData] = useState(data);
  const [currentFilters, setCurrentFilters] = useState<AppliedFilter[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
  const dateToExternalFilter = storeReportsStore((store) => store.dateToExternalFilter);
  const setDateToExternalFilter = storeReportsStore((store) => store.setDateToExternalFilter);

  // --- start advance filter ---

  const filterAndSortHandler = (filters: AppliedFilter[], sortConfigToUse: SortConfig) => {
    let currentData = data;
    for (const filter of filters) {
      if (!filter.field || !filter.condition) continue;
      if (filter.value === null && filter.condition !== 'is' && filter.condition !== 'isNot')
        continue;

      currentData = executeFilter(currentData, filter);
    }

    let finalData = currentData;
    if (sortConfigToUse.key) {
      finalData = getSortedData(currentData, sortConfigToUse);
    }

    setFilteredData(finalData);
  };

  const filterHandler = (filters: AppliedFilter[]) => {
    setCurrentFilters(filters);
    filterAndSortHandler(filters, sortConfig);
  };

  const sortHandler = (key: string) => {
    let direction: SortConfig['direction'] = 'ascending';

    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      return clearSort();
    }

    const newConfig: SortConfig = { key, direction };
    setSortConfig(newConfig);

    filterAndSortHandler(currentFilters, newConfig);
  };

  const clearSort = () => {
    const emptyConfig: SortConfig = { key: null, direction: null };
    setSortConfig(emptyConfig);

    filterAndSortHandler(currentFilters, emptyConfig);
  };

  useEffect(() => {
    filterAndSortHandler(currentFilters, sortConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // --- end advance filter ---

  // --- start date filter ---

  const [inputs, setInputs] = useState(inputsInitialState);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value, name } = e.currentTarget;
    const { identity } = e.currentTarget.dataset;
  };

  const handleChangeInputs = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const filterControl = () => {
    let currentFilteredData = data;

    // input

    Object.keys(inputs).forEach((inputKey) => {
      const searchValue = inputs[inputKey as keyof typeof inputs];

      if (!searchValue) return;

      const dataProperty = (accessorMap && accessorMap[inputKey]) || inputKey;

      const searchTerms = searchValue.toLowerCase().split(' ');

      currentFilteredData = currentFilteredData.filter((el) => {
        const dataValue = el?.[dataProperty]?.toLowerCase();

        if (!dataValue) return false;

        return searchTerms.every((word) => dataValue.includes(word));
      });
    });

    setFilteredData(currentFilteredData);
  };

  const resetGeneralFilter = () => {
    setInputs(inputsInitialState);
    setDateToExternalFilter(null); // today
  };

  useEffect(() => {
    filterControl();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  // --- end date filter ---

  return {
    tableData: filteredData,
    filterHandler,
    sortHandler,
    sortConfig,
    clearSort,
    regularFilters: {
      onClick: handleClick,
      onInputChange: handleChangeInputs,
      inputs: inputs,
    },
    dateToExternalFilter,
    resetGeneralFilter,
  };
}

const getSortedData = (dataToSort: any[], config: SortConfig): any[] => {
  if (!config.key || !config.direction) {
    return dataToSort;
  }

  const sortableData = [...dataToSort];

  sortableData.sort((a, b) => {
    const aValue = resolveNestedProperty(a, config.key!);
    const bValue = resolveNestedProperty(b, config.key!);

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

export const executeFilter = <T extends Record<string, any>>(
  dataArray: T[],
  filter: AppliedFilter,
): T[] => {
  if (!dataArray || dataArray.length === 0 || !filter.field || !filter.condition) {
    return dataArray;
  }

  const { field, condition, value, value2 } = filter;

  return dataArray.filter((item) => {
    const itemValue = resolveNestedProperty(item, field);

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

const resolveNestedProperty = (obj: any, path: string): any => {
  if (!obj || !path) return undefined;

  const parts = path.split('.');

  return parts.reduce((currentObj, key) => {
    if (currentObj === null || currentObj === undefined) {
      return undefined;
    }
    return currentObj[key];
  }, obj);
};
