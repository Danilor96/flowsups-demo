import { FundingLogStatisticsSummary } from '@/app/api/reports/fundingLog/types';

export async function getData(monthFilterParams: string) {
  const res = await fetch(`/api/reports/fundingLog/statistics?${monthFilterParams}`);

  const json: FundingLogStatisticsSummary[] = await res.json();

  return json;
}
