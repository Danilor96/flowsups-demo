import { BdcLogSummary } from '@/app/api/reports/bdcLog/types';

export const getData = async (monthFilterParams: string) => {
  const res = await fetch(`/api/reports/bdcLog?${monthFilterParams}`);

  const json: BdcLogSummary[] = await res.json();

  return json;
};
