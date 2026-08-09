import { CreditAppReportSummary } from '@/app/api/reports/storeReport/creditApp/types';

export const getData = async (dateQueryString?: string | null) => {
  const res = await fetch(
    `/api/reports/storeReport/creditApp${dateQueryString ? `?${dateQueryString}` : ''}`,
  );

  const json: CreditAppReportSummary[] = await res.json();

  return json;
};
