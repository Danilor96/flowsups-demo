import { InboundCallDetail } from '@/app/api/reports/storeReport/callActivity/inbound/types';

export const getData = async ({
  inbound,
  userId,
  dateQueryString,
}: {
  userId: number;
  inbound: boolean;
  dateQueryString?: string | null;
}) => {
  const direction = inbound ? 'inbound' : 'outbound';
  const res = await fetch(
    `/api/reports/storeReport/callActivity/${direction}/${userId}${
      dateQueryString ? `?${dateQueryString}` : ''
    }`,
  );

  const json: InboundCallDetail[] = await res.json();

  return json;
};
