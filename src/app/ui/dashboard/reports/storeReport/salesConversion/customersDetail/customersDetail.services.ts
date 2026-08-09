import { SalesConversionCustomersDetail } from '@/app/api/reports/storeReport/salesConversion/types';

export const getData = async (
  userId: number,
  customerStatusId: number,
  dateQueryString?: string | null,
) => {
  const res = await fetch(
    `/api/reports/storeReport/salesConversion/${userId}?customerStatusId=${customerStatusId}${
      dateQueryString ? `&${dateQueryString}` : ''
    }`,
  );

  const json: SalesConversionCustomersDetail[] = await res.json();

  return json;
};
