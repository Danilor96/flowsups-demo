import { ReferrerSummary } from '@/app/api/reports/storeReport/referrerReport/type';

export const getData = async (dateQueryString?: string | null) => {
  const res = await fetch(`/api/reports/storeReport/referrerReport${dateQueryString ? `?${dateQueryString}` : ''}`);

  const json: ReferrerSummary[] = await res.json();

  return json;
};
