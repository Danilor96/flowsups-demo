import { clientMessagesStore, currentSectionStore, modalWindowStore, singleCLientDataStore } from '@/store/adminDashboard';
import { useEffect, useState } from 'react';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { CustomerContactFormat } from '&/miscellaneous/customerContactFormat/CustomerContactFormat';
import { dateFormatsStore } from '@/store/dateFormats';
import { DailyMessageContainer } from '&/dashboard/dailyDataBar/dailyMessages/dailyMessageContainer/DailyMessageContainer';
import { useSession } from 'next-auth/react';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { DailyMessage } from '@/app/libs/definitions';

export function DailyMessages() {
  // ----- global states -----
  const { data: session } = useSession();

  const userId = session?.user.id;

  const { closeDailyMessages, openDashboardSmsModal } = modalWindowStore();

  const { getDailyMessages } = clientMessagesStore();
  const { dailyMessages } = clientMessagesStore();

  const { getCurrentSection } = currentSectionStore();

  const { dateFormatted } = dateFormatsStore();

  const { formatPhoneNumber } = phoneNumbersFormatStore();
  const getSingleClientData = singleCLientDataStore(state => state.getSingleClientData);
  const getClientMessagesByPhoneNumber = clientMessagesStore(state => state.getClientMessagesByPhoneNumber);


  useEffect(() => {
    getCurrentSection('Daily messages');
    if (userId) {
      getDailyMessages(userId).finally(() => {
        setLoading(false);
      });
    }
  }, [userId, getDailyMessages, getCurrentSection]);

  // ----- local states -----

  const [loading, setLoading] = useState<boolean>(true);

  const [tableData, setTableData] = useState<any[]>([]);

  const initialColumnsDef = {
    message: true,
    phone: true,
    assigned_to: true,
    from: true,
    time: true,
    customerIdForSingleClientData: false,
    unknowCustomerIdForData: false,
  };

  const columnRenderers: { [key in keyof typeof initialColumnsDef]?: (el: DailyMessage) => any } = {
    message: messageData => (
      <DailyMessageContainer
        customerId={messageData.client_id}
        lastMessage={messageData.message}
        name={`${messageData?.client_message?.first_name || ''} ${messageData?.client_message?.last_name || ''}`}
        status={messageData?.client_message?.client_status?.status || 'Unregistered Customer'}
      />
    ),
    phone: messageData => (
      <CustomerContactFormat
        contact={
          messageData?.client_message?.mobile_phone || messageData.unregistered_customer?.[0]?.mobile_phone_number || ''
        }
        noIcon
        marginInlineAuto
      />
    ),
    assigned_to: messageData => `${messageData.sender_user?.name || ''} ${messageData.sender_user?.last_name || ''}`,
    from: messageData => 'SMS',
    time: messageData => dateFormatted(1, messageData.date_sent),
  }; 

  const { columns } = useDynamicTableColumns<DailyMessage, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['customerIdForSingleClientData', 'unknowCustomerIdForData'],
    columnStyles: {message: { size: 250 }},
    columnRenderers,
    accessorFnMapper: {
      message: (messageData) => messageData.message,
      phone: (messageData) => messageData?.client_message?.mobile_phone || messageData.unregistered_customer[0]?.mobile_phone_number || '',
      assigned_to: (messageData) => `${messageData.sender_user?.name || ''} ${messageData.sender_user?.last_name || ''}` || '',
      from: (messageData) => 'SMS',
      time: (messageData) => dateFormatted(1, messageData.date_sent),
    },
  });

  useEffect(() => {
    if (dailyMessages && dailyMessages.length > 0) {
      let newTableData: any[] = [];

      dailyMessages.forEach((messageData) => {
        newTableData.push({
          ...messageData,
          id: messageData.client_id || messageData?.unregistered_customer[0]?.id,
          customerIdForSingleClientData: messageData?.client_id,
          unknowCustomerIdForData: messageData?.unregistered_customer[0]?.mobile_phone_number,
        });
      });

      setTableData(newTableData);
    }
  }, [dailyMessages, dateFormatted]);

  const handleDoubleClick = async (originalRow: any) => {
    const row = originalRow;
    openDashboardSmsModal();
    if (row.customerIdForSingleClientData) {
      getSingleClientData(row.customerIdForSingleClientData.toString());
    } else if (row.unknowCustomerIdForData) {
      await getClientMessagesByPhoneNumber(row.unknowCustomerIdForData);
    }
  };

  return (
    <ModalWindow top={0} positionFixed>
      <ModalContainer width={86.510417} marginTop={7.592593}>
        <ModalContainerTitle title="Daily Messages" closeWindowFunction={closeDailyMessages} openNewTab />
        <ModalContent>
          <ColoredTableV2
            data={tableData}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            itemsPerPage={5}
            loading={loading}
            paginationIsActive
            textColor="#FFF"
            height={65}
            rowSelectionIsActive={false}
            onRowDoubleClick={rowOriginalData => handleDoubleClick(rowOriginalData)}
          />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
