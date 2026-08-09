import { ComissionBdcSummary } from '@/app/api/reports/storeReport/comissionReport/types';

export const getData = async (monthFilterParams: string) => {
  const res = await fetch(`/api/reports/storeReport/comissionReport/bdc?${monthFilterParams}`);

  const json: ComissionBdcSummary[] = await res.json();

  return json;
};
