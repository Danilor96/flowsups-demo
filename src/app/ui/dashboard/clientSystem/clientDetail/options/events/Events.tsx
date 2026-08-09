import {
  adminDashboardStore,
  modalWindowStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import { useEffect, useState } from 'react';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { dateFormatsStore } from '@/store/dateFormats';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';

export function Events() {
  // ----- global states -----
  const { closeClientEvents } = modalWindowStore();

  const { clientEvents } = adminDashboardStore();
  const { getClientEvents } = adminDashboardStore();

  const { singleCLientData } = singleCLientDataStore();

  const { dateFormatted } = dateFormatsStore();

  useEffect(() => {
    if (singleCLientData && singleCLientData?.id) {
      getClientEvents(singleCLientData?.id.toString()).finally(() => setLoading(false));
    }
  }, [getClientEvents, singleCLientData]);

  // ----- local states -----

  const [loading, setLoading] = useState(true);

  const [tableData, setTableData] = useState<any[]>([
    {
      id: '',
      description: '',
      updated_date: '',
      updated_by: '',
    },
  ]);

  const initialColumnsDef = {
    description: true,
    updated_date: true,
    updated_by: true,
  };

  const { columns } = useDynamicTableColumns({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnStyles: {
      description: { size: 200 },
      updated_by: { size: 100},
    }
  });

  useEffect(() => {
    if (clientEvents.length > 0) {
      const newTableData: any[] = [];

      for (let i = 0; i < clientEvents.length; i++) {
        const event = clientEvents[i];

        newTableData.push({
          id: event.id,
          description: event.description ? <p className='flex-wrap break-words whitespace-normal max-w-[30vw]'>{event.description}</p> : '' ,
          updated_date: dateFormatted(3, event.updated_at),
          updated_by: `${event?.event_creator?.name || 'System'} ${
            event?.event_creator?.last_name || ''
          }`,
        });
      }

      setTableData(newTableData);
    } else {
      setTableData([
        {
          id: '',
          description: '',
          updated_date: '',
          updated_by: '',
        },
      ]);
    }
  }, [clientEvents, dateFormatted]);

  return (
    <ModalWindow top={0} positionFixed>
      <ModalContainer width={84.8125} marginTop={5.5}>
        <ModalContainerTitle title="Events" closeWindowFunction={closeClientEvents} />
        <ModalContent>
          <ColoredTableV2
            data={tableData}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            itemsPerPage={12}
            loading={loading}
            paginationIsActive
            textColor="#FFF"
            height={62}
            rowSelectionIsActive={false}
          />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
