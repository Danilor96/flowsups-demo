import { VisitReportData } from '@/app/api/reports/storeReport/visitReport/types';

export const getData = async ({ dateQueryString }: { dateQueryString?: string | null }) => {
  const res = await fetch(
    `/api/reports/storeReport/visitReport${dateQueryString ? `?${dateQueryString}` : ''}`,
  );

  const json: VisitReportData[] = await res.json();

  return json;
};
