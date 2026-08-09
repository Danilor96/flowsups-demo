import { RefScoreSummary } from '@/app/api/reports/storeReport/referrerReport/type';

export const getData = async (dateQueryString?: string | null) => {
  const res = await fetch(
    `/api/reports/storeReport/referrerReport/refScore${
      dateQueryString ? `?${dateQueryString}` : ''
    }`,
  );

  const json: RefScoreSummary[] = await res.json();

  return json;
};
