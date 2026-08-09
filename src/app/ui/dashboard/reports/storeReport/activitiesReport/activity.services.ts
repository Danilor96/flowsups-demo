import { ActivityReport } from '@/app/api/reports/storeReport/activitiesReport/types';

export const getData = async (dateQueryString?: string | null) => {
  const res = await fetch(
    `/api/reports/storeReport/activitiesReport${dateQueryString ? `?${dateQueryString}` : ''}`,
  );

  const json: ActivityReport[] = await res.json();

  return json;
};
