import { adminDashboardStore, currentSectionStore, modalWindowStore } from '@/store/adminDashboard';
import { useEffect, useMemo, useState } from 'react';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { InboundCallIcon, OutboundCallIcon } from '&/icons/Icons';
import { DateFormats } from '&/miscellaneous/dateFormats/DateFormats';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { useSession } from 'next-auth/react';
import { ColoredTableV2 } from '../table/coloredTable/v2';
import { ColumnDef } from '@tanstack/react-table';
import { useDynamicTableColumns } from '../table/coloredTable/v2/useColumDef';
import { DailyCall } from '@/app/libs/definitions';
import type { DailyCalls } from '@/app/libs/definitions';
import { UsersAssignedTo } from '../miscellaneous/splitSellersInfo/SplitSellersInfo';

const initialColumnsDef = {
  customer: true,
  call_type: true,
  duration: true,
  assigned_to: true,
  date: true,
};

export function DailyCalls() {
  // global states
  const { data: session } = useSession();

  const userId = session?.user.id;

  const { closeDailyCalls } = modalWindowStore();

  const { dailyCalls } = adminDashboardStore();
  const { getDailysCalls } = adminDashboardStore();

  const { formatPhoneNumber } = phoneNumbersFormatStore();

  const { getCurrentSection } = currentSectionStore();

  useEffect(() => {
    getCurrentSection('Daily calls');
    if (userId) {
      getDailysCalls(userId).finally(() => {
        setLoading(false);
      });
    }
  }, [userId, getDailysCalls, getCurrentSection]);

  // local states
  const [loading, setLoading] = useState<boolean>(true);

  const [tableData, setTableData] = useState<any[]>([
    {
      id: '',
      customer: '',
      call_type: '',
      duration: '',
      assigned_to: '',
      date: '',
    },
  ]);

  const columnRenderers: { [key in keyof typeof initialColumnsDef]: (el: DailyCall) => any } = {
    customer: el => (
      <div>
        <CustomerName
          customer={`${el.client_call?.first_name || 'Unknow'} ${el.client_call?.last_name || ''}`}
          customerId={el.client_call?.id}
        />
        {el.phone_number && <p>{formatPhoneNumber(el.phone_number)}</p>}
      </div>
    ),
    call_type: el =>
      el.call_direction_id === 1 ? <InboundCallIcon centerContent /> : <OutboundCallIcon centerContent />,
    duration: el => handleCallDuration(el.call_duration),
    assigned_to: el => (
      <UsersAssignedTo
        users={el.user || [] }
      />
    ),
    date: el => <DateFormats date={el.call_date} format={1} />,
  };

  const { columns } = useDynamicTableColumns<DailyCall, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnRenderers,
     accessorFnMapper: {
      customer: el => `${el.client_call?.first_name || 'Unknow'} ${el.client_call?.last_name || ''}`,
      call_type: el => el.call_direction_id === 1 ? 'Inbound' : 'Outbound',
      assigned_to: el => el.user?.map(user => `${user.name || ''} ${user.last_name || ''}`).join(', ') || '',
      date: el => el.call_date,
      duration: el => handleCallDuration(el.call_duration),
     },
    columnDataTypes: {
      date: 'date',
    }
  });

  useEffect(() => {
    if (dailyCalls && dailyCalls.length > 0) {
      // setTableData(dailyCalls);
    } else {
      setTableData([]);
    }
  }, [dailyCalls, formatPhoneNumber]);

  const handleCallDuration = (seconds: string) => {
    const numSeconds = parseInt(seconds);
    const secondsPerMinute = 60;
    const secondsPerHour = 3600;

    const hours = Math.floor(numSeconds / secondsPerHour);
    const minutes = Math.floor((numSeconds % secondsPerHour) / secondsPerMinute);
    const remainingSeconds = numSeconds % secondsPerMinute;
    let result = '';

    if (seconds === '0') return 'Unanswered';

    if (hours > 0) {
      result = `${hours} h `;
    }
    if (minutes > 0) {
      result += `${minutes} min `;
    }
    if (remainingSeconds > 0 || (hours === 0 && minutes === 0)) {
      result += `${remainingSeconds} sec`;
    }

    return result;
  }; 

  return (
    <ModalWindow top={0} positionFixed>
      <ModalContainer marginTop={7.592593} width={86.510417}>
        <ModalContainerTitle title="Daily Calls" closeWindowFunction={closeDailyCalls} openNewTab />
        <ModalContent>
          {/* <ColoredTable
            height={66.851852}
            tableData={tableData}
            textColor="#FFF"
            headTextCenter
            bodyTextCenter
            loading={loading}
            paginationTable
            itemsPerPage={12}
          /> */}
          <ColoredTableV2
            data={dailyCalls || []}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            loading={loading}
            paginationIsActive
            textColor="#FFF"
            // width={tableWidth}
            itemsPerPage={11}
            height={66.851852}
            rowSelectionIsActive={false}
          />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
