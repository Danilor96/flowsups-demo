import { CustomersForInfiniteScroll } from '@/app/api/customerSelect/types';

export const getCustomersForInfiniteScroll = async ({
  currentCursor,
  isFirstLoad,
  query,
}: {
  isFirstLoad: boolean;
  query: string;
  currentCursor: string | number | null;
}) => {
  const res = await fetch(
    `api/customerSelect?q=${query}${!isFirstLoad && currentCursor ? `&cursor=${currentCursor}` : ''}`,
  );

  const json: { customers: CustomersForInfiniteScroll[]; nextCursor: number | null } =
    await res.json();

  return json;
};
