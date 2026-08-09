import { AmountForm } from '@/app/api/reports/storeReport/comissionReport/types';

export const getData = async (userId: number, type: string) => {
  const res = await fetch(`/api/reports/storeReport/comissionReport/amount/${userId}?type=${type}`);

  const json: AmountForm[] = await res.json();

  return json;
};
