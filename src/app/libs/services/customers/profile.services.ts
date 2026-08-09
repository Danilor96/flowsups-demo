import { LeadHistory, TaskLeadHistory } from '@/app/api/customerDetail/leadHistory/type';

export const getLeadHistory = async ({
  currentCursor,
  customerId,
  isFirstLoad,
  cheatFetchCount,
}: {
  currentCursor: number | string | null;
  isFirstLoad?: boolean;
  customerId: number | string;
  cheatFetchCount?: boolean;
}) => {
  const res = await fetch(
    `/api/customerDetail/leadHistory/${customerId}${!isFirstLoad && currentCursor ? `?cursor=${currentCursor}` : ''}${cheatFetchCount ? '?getLastLead=true' : ''}`,
  );

  const json: {
    leadHistoryCombined: (LeadHistory | TaskLeadHistory)[];
    nextCursor: string | null;
  } = await res.json();

  return json;
};
