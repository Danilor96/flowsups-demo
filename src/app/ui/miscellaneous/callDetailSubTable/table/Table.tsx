import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useCallback, useState } from 'react';
import { CustomerName } from '../../customerName/CustomerName';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { getData } from './table.services';
import { NoteButton } from './noteButton/NoteButton';
import { InboundCallDetail } from '@/app/api/reports/storeReport/callActivity/inbound/types';
import { dateFormatsStore } from '@/store/dateFormats';
import { storeReportsStore } from '@/store/reports';
import { buildDateQueryString } from '@/app/libs/buildDatePrismaFilter';
import { reportsFiltersStore, transformDateToQuery } from '@/store/filtersHandling';

export function Table({
  userId,
  onCloseWindow,
  inbound,
  userName,
}: {
  userId: number;
  userName: string;
  onCloseWindow: () => void;
  inbound: boolean;
}) {
  // ----- global states -----

  const { dateFormatted } = dateFormatsStore();

  const createDate = reportsFiltersStore((store) => store.createDate);

  // ----- local states -----

  const getPromiseData = useCallback(() => {
    return [fetchData()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading } = useLoadingGetData(getPromiseData);

  const [data, setData] = useState<InboundCallDetail[]>([]);

  const fetchData = async () => {
    const resultForQuery = transformDateToQuery(createDate);
    const dateQuery = resultForQuery ? buildDateQueryString(resultForQuery) : null;
    const fetchedData = await getData({
      userId,
      inbound,
      dateQueryString: dateQuery,
    });

    if (fetchedData && fetchedData.length > 0) {
      setData(fetchedData);
    }
  };

  type CallDetailArray = Exclude<InboundCallDetail[], undefined>;

  type CallDetailItem = CallDetailArray[number];

  const columnRenderers: { [key: string]: (el: CallDetailItem) => any } = {
    customer: (el) => <CustomerName customer={el.customerName} customerId={el.customerId} />,
    inbound: (el) => el.inbound,
    follow_up: (el) => dateFormatted(2, el.followUp),
    call_made_at: (el) => dateFormatted(5, el.callMadeAt),
    customer_status: (el) => el.customerStatus,
    notes: (el) => <NoteButton notes={el.notes} />,
  };

  let initialColumnsDef = {
    customer: true,
    inbound: true,
    follow_up: true,
    call_made_at: true,
    customer_status: true,
    notes: true,
  };

  const { columns } = useDynamicTableColumns<InboundCallDetail, typeof initialColumnsDef>({
    initialColumnsDef,
    columnRenderers,
    accessorFnMapper: {
      customer: (el) => el.customerName,
      inbound: (el) => el.inbound,
      follow_up: (el) => el.followUp,
      call_made_at: (el) => el.callMadeAt,
      customer_status: (el) => el.customerStatus,
      notes: (el) => (el.notes && el.notes.length > 0 ? el.notes[0].note : ''),
    },
  });

  initialColumnsDef = {
    ...initialColumnsDef,
  } as any;

  return (
    <ModalWindow>
      <ModalContainer marginTop={7} width={80}>
        <ModalContainerTitle
          closeWindowFunction={onCloseWindow}
          title={`${userName}'s call details`}
        />
        <ModalContent>
          <ColoredTableV2 columns={columns} data={data} loading={loading} textColor="#FFF" />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
