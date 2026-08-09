import { SmsDetail } from '@/app/api/reports/storeReport/callActivity/smsDetail/types';

export const getData = async ({
  userId,
  dateQueryString,
  auto,
  smsStatus,
}: {
  userId: number;
  dateQueryString?: string | null;
  auto?: boolean;
  smsStatus?: 'sent' | 'delivered' | 'failed' | 'clientReplied' | null;
}) => {
  const res = await fetch(
    `/api/reports/storeReport/callActivity/smsDetail/${userId}?${
      dateQueryString ? `${dateQueryString}` : ''
    }${auto ? (dateQueryString ? `&auto=${auto}` : `&auto=${auto}`) : ''}${smsStatus ? `&smsStatus=${smsStatus}` : ''}`,
  );

  const json: SmsDetail[] = await res.json();

  return json;
};
