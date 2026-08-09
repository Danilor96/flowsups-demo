import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { useCallback, useState } from 'react';
import { getData } from './smsDetail.services';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { useDynamicTableColumns } from '&/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '&/table/coloredTable/v2';
import { SmsList } from './smsList/SmsList';
import { SmsDetail } from '@/app/api/reports/storeReport/callActivity/smsDetail/types';
import { storeReportsStore } from '@/store/reports';
import { buildDateQueryString } from '@/app/libs/buildDatePrismaFilter';
import { reportsFiltersStore, transformDateToQuery } from '@/store/filtersHandling';

export function Table({
  onCloseWindow,
  userId,
  userName,
  auto,
  smsStatus,
}: {
  userId: number;
  onCloseWindow: () => void;
  userName: string;
  auto?: boolean;
  smsStatus?: 'sent' | 'delivered' | 'failed' | 'clientReplied' | null;
}) {
  // ----- global states -----
  const dateToExternalFilter = storeReportsStore((store) => store.dateToExternalFilter);

  const createDate = reportsFiltersStore((store) => store.createDate);

  // ----- local states -----

  const getPromiseData = useCallback(() => {
    return [fetchData()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading } = useLoadingGetData(getPromiseData);

  const [data, setData] = useState<SmsDetail[]>([]);

  const fetchData = async () => {
    const resultForQuery = transformDateToQuery(createDate);
    const dateQuery = resultForQuery ? buildDateQueryString(resultForQuery) : null;
    const fetchedData = await getData({ userId, dateQueryString: dateQuery, auto, smsStatus });

    if (fetchedData && fetchedData.length > 0) {
      setData(fetchedData);
    }
  };

  type SmsDetailArray = Exclude<SmsDetail[], undefined>;

  type SmsDetailItem = SmsDetailArray[number];

  const columnRenderers: { [key: string]: (el: SmsDetailItem) => any } = {
    customer: (el) => <CustomerName customer={el.customerName} customerId={el.customerId} />,
    status: (el) => el.customerStatus,
    total_sms: (el) => el.smsData.length,
    sms: (el) => {
      const lastSms = el.smsData[el.smsData.length - 1];

      return (
        <SmsList
          lastSmsText={lastSms.message}
          customerName={el.customerName}
          smsData={el.smsData}
        />
      );
    },
  };

  let initialColumnsDef = {
    customer: true,
    status: true,
    total_sms: true,
    sms: true,
  };

  const { columns } = useDynamicTableColumns<SmsDetail, typeof initialColumnsDef>({
    initialColumnsDef,
    columnRenderers,
    accessorFnMapper: {
      customer: (el) => el.customerName,
      status: (el) => el.customerStatus,
      total_sms: (el) => el.smsData.length,
      sms: (el) => '',
    },
  });

  initialColumnsDef = {
    ...initialColumnsDef,
  } as any;

  return (
    <ModalWindow>
      <ModalContainer marginTop={7} width={75}>
        <ModalContainerTitle
          title={`${userName}'s sms details`}
          closeWindowFunction={onCloseWindow}
        />
        <ModalContent>
          <ColoredTableV2 columns={columns} data={data} loading={loading} textColor="#FFF" />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
