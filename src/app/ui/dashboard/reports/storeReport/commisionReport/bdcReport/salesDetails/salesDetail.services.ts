import { SalesSummary } from '@/app/api/reports/storeReport/comissionReport/types';

export const getData = async (userId: number, monthFilterParams: string) => {
  const res = await fetch(
    `/api/reports/storeReport/comissionReport/bdc/${userId}?${monthFilterParams}`,
  );

  const json: SalesSummary[] = await res.json();

  return json;
};
