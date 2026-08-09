import { CreditAppData } from '@/app/api/adminDashboard/creditApp/types';

export const getData = async (customerId?: number | null) => {
  const res = await fetch(`/api/adminDashboard/creditApp/${customerId}`);

  const json: CreditAppData = await res.json();

  return json;
};
