import { BdcLogStatisticsSummary } from '@/app/api/reports/bdcLog/types';

export const getData = async (monthFilterParams: string) => {
  const res = await fetch(`/api/reports/bdcLog/statistics?${monthFilterParams}`);

  const json: BdcLogStatisticsSummary[] = await res.json();

  return json;
};
