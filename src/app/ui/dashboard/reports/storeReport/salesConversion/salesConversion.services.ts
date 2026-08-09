import {
  SalesConversionSummary,
  SalesConversionSummaryColsTotal,
} from '@/app/api/reports/storeReport/salesConversion/types';

export const getData = async (dateQueryString?: string | null) => {
  const res = await fetch(
    `/api/reports/storeReport/salesConversion${dateQueryString ? `?${dateQueryString}` : ''}`,
  );

  const json: {
    salesConversionSummary: SalesConversionSummary[];
    colsTotals: SalesConversionSummaryColsTotal;
  } = await res.json();

  return json;
};
