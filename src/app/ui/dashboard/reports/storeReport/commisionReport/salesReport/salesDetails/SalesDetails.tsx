import { SalesSummary } from '@/app/api/reports/storeReport/comissionReport/types';
import { getMonthDateRangeParams } from '@/app/libs/monthAndYearDateFilter';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useCalendarStore } from '@/store/monthNavigation';
import { useCallback, useEffect, useState } from 'react';
import { getData } from './salesDetail.services';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { dateFormatsStore } from '@/store/dateFormats';
import { useDynamicTableColumns } from '&/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '&/table/coloredTable/v2';

export function SalesDetails({ userId, closeFn }: { userId: number; closeFn: () => void }) {
  // global states

  const { formatPhoneNumber } = phoneNumbersFormatStore();

  const { dateFormatted } = dateFormatsStore();

  const { currentMonth, currentYear, currentWeek, setFetchingData } = useCalendarStore();

  const getPromiseData = useCallback(() => {
    return [fetchData()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const { loading } = useLoadingGetData(getPromiseData);

  // local states

  const [data, setData] = useState<SalesSummary[]>([]);

  const fetchData = async () => {
    const urlParams = getMonthDateRangeParams(currentMonth, currentYear, currentWeek);

    const res = await getData(userId, urlParams);

    setData(res);
  };

  const columnRenderers: { [key: string]: (el: SalesSummary) => any } = {
    customerName: (el) => <CustomerName customer={el.customerName} customerId={el.customerId} />,
    stockNumber: (el) => el.stockNumber,
    vehicle: (el) => el.vehicle,
    phoneNumber: (el) => formatPhoneNumber(el.phoneNumber),
    dealDate: (el) => dateFormatted(5, el.dealDate),
    dealStatus: (el) => el.dealStatus,
  };

  const initialColumnsDef = {
    customerName: true,
    stockNumber: true,
    vehicle: true,
    phoneNumber: true,
    dealDate: true,
    dealStatus: true,
  };

  const { columns } = useDynamicTableColumns<SalesSummary, typeof initialColumnsDef>({
    columnRenderers,
    initialColumnsDef,
    accessorFnMapper: {
      customerName: (el) => el.customerName,
      stockNumber: (el) => el.stockNumber,
      vehicle: (el) => el.vehicle,
      phoneNumber: (el) => el.phoneNumber,
      dealDate: (el) => el.dealDate,
      dealStatus: (el) => el.dealStatus,
    },
  });

  useEffect(() => {
    setFetchingData(loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <ModalWindow>
      <ModalContainer marginTop={3} width={88}>
        <ModalContainerTitle title="Sales Details" closeWindowFunction={closeFn} />
        <ModalContent>
          <ColoredTableV2
            columns={columns}
            data={data}
            initialColumnsDef={initialColumnsDef}
            textColor="#FFF"
            height={55.833333}
            paginationIsActive
            itemsPerPage={8}
            printButtonIsActive
            loading={loading}
          />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
