import { adminDashboardStore } from '@/store/adminDashboard';
import { useCallback, useEffect, useState } from 'react';
import { StatusContainer } from './statusContainer/StatusContainer';
import { CustomersStatuses, customerStatusName, CUSTOMER_STATUSES_LIST } from '@/app/libs/customer/customersFunctions';
import { useLoadingGetData } from '@/hooks/loadingGetData';

export function StatusesList({
  onClick,
}: {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // ----- global states -----

  const { clientStatusesData } = adminDashboardStore();
  const { getClientStatuses, getLostReasons } = adminDashboardStore();

  const getPromiseData = useCallback(() => {
    return [getLostReasons()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading } = useLoadingGetData(getPromiseData);

  // ----- local states -----

  return (
    <ul className="relative min-w-[23.744272vw] min-h-[64.20371vh] px-[6.395313vw] py-[2.040741vh] rounded-[1.041667vw] border border-[#C9EBE6] overflow-hidden">
      {CUSTOMER_STATUSES_LIST.map((el, index) => (
        <li
          key={`${el.id}statusesList${index}`}
          className="flex flex-col justify-center items-center"
        >
          {index !== 0 && <div className="w-[0.2vw] h-[1vh] bg-[#00A78B]"></div>}
          <StatusContainer status={el.status} statusId={el.id} onClick={onClick} />
        </li>
      ))}
    </ul>
  );
}
