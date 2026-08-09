import { ComissionSalesRepSummary } from '@/app/api/reports/storeReport/comissionReport/types';

export const getData = async (monthFilterParams: string) => {
  const res = await fetch(
    `/api/reports/storeReport/comissionReport/salesConsultant?${monthFilterParams}`,
  );

  const json: ComissionSalesRepSummary[] = await res.json();

  return json;
};
