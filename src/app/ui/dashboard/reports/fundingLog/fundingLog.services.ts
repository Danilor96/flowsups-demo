import { FundingLogSummary } from '@/app/api/reports/fundingLog/types';

export const getData = async (monthFilterParams: string) => {
  const res = await fetch(`/api/reports/fundingLog?${monthFilterParams}`);

  const json: FundingLogSummary[] = await res.json();

  return json;
};
