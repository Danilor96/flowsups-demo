import {
  adminDashboardStore,
  clientMessagesStore,
  currentSectionStore,
  modalWindowStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import { StarIcon } from '&/icons/Icons';
import { useEffect, useState } from 'react';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { CustomerContactFormat } from '&/miscellaneous/customerContactFormat/CustomerContactFormat';
import { dateFormatsStore } from '@/store/dateFormats';
import { useSession } from 'next-auth/react';
import { useDynamicTableColumns } from '../table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '../table/coloredTable/v2';
import { Task } from 'twilio/lib/twiml/VoiceResponse';

export function MissingTasks() {
  // global states
  const { data: session } = useSession();

  const userId = session?.user.id;

  const { closeMissingTasks } = modalWindowStore();
  const openInNewTab = modalWindowStore((state) => state.openInNewTab);
  const openTaskDetail = modalWindowStore((store) => store.openTaskDetail);
  const getSingleClientTasks = adminDashboardStore((store) => store.getSingleClientTasks);

  const { missingTasks } = adminDashboardStore();
  const { getMissingTasks } = adminDashboardStore();

  const { dateFormatted } = dateFormatsStore();

  const { getCurrentSection } = currentSectionStore();

  useEffect(() => {
    getCurrentSection('Missing tasks');
    if (userId) {
      getMissingTasks(userId).finally(() => {
        setLoading(false);
      });
    }
  }, [userId, getMissingTasks, getCurrentSection]);

  // local states

  const [loading, setLoading] = useState<boolean>(true);

  const [tableData, setTableData] = useState<any[]>([
    {
      id: '',
      _blank_managerTask: '',
      customer: '',
      customerContact: '',
      deadline: '',
    },
  ]);

  const initialColumnsDef = {
    _blank_managerTask: true,
    customer: true,
    customerContact: true,
    deadline: true,
  };

  const columnRenderers: { [key: string]: (el: any) => any } = {
    id: el => el.id,
    _blank_managerTask: el =>
      el.manager_task && (
        <div className="w-fit h-fit mx-auto">
          <StarIcon />
        </div>
      ),
    customer: (el: any) => (
      <CustomerName
        customer={`${el.customer?.first_name || ''} ${el.customer?.last_name || ''}`}
        customerId={el.customer_id ?? undefined}
      />
    ),
    customerContact: (el: any) => (
      <CustomerContactFormat
        contact={`${el.customer?.mobile_phone}`}
        customerId={el.customer_id ?? undefined}
        marginInlineAuto
      />
    ),
    deadline: (el: any) => dateFormatted(3, el.deadline),
  };

  const { columns } = useDynamicTableColumns<Task, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    hideHeaderFor: ['_blank_managerTask'],
    columnStyles: { _blank_managerTask: { size: 60 } },
    columnRenderers,
    sortableColumns: ['customer', 'customerContact', 'deadline'],
    accessorFnMapper: {
      _blank_managerTask: el => el.manager_task ? 'Manager task' : '',
      customer: el => `${el.customer?.first_name || ''} ${el.customer?.last_name || ''}`,
      customerContact: el => `${el.customer?.mobile_phone}`,
      deadline: el => el.deadline,
    },
    columnDataTypes: {
      deadline: 'date',
    },
    filterableColumns: ['customer', 'customerContact', 'deadline'],
  });

  useEffect(() => {
    if (missingTasks && missingTasks.length > 0) {
      const newArray: any[] = [];

      // missingTasks.forEach((el, index) => {

      //   newArray.push({
      //     id: `${el.id}`,
      //     _blank_managerTask: el.manager_task && (
      //       <div className="w-fit h-fit mx-auto">
      //         <StarIcon />
      //       </div>
      //     ),
      //     customer: (
      //       <CustomerName
      //         customer={`${el.customer?.first_name || ''} ${el.customer?.last_name || ''}`}
      //         customerId={el.customer_id ?? undefined}
      //       />
      //     ),
      //     customerContact: (
      //       <CustomerContactFormat
      //         contact={`${el.customer?.mobile_phone}`}
      //         customerId={el.customer_id ?? undefined}
      //         marginInlineAuto
      //       />
      //     ),
      //     deadline: dateFormatted(3, el.deadline),
      //   });
      // });
      // setTableData(newArray);
      setTableData(missingTasks);
    }
  }, [missingTasks, dateFormatted]);

  const columnsWidth = [
    {
      column: '_blank_managerTask',
      widthInPorcent: 10,
    },
    {
      column: 'customer',
      widthInPorcent: 30,
    },
    {
      column: 'customerContact',
      widthInPorcent: 30,
    },
    {
      column: 'deadline',
      widthInPorcent: 30,
    },
  ];

  const handleOpenTask = (taskId: number) => {
    if (taskId) {
      if (openInNewTab) {
        window.open(`/dashboard/task-${taskId}`);

        return;
      }

      getSingleClientTasks(taskId.toString());

      openTaskDetail();
    }
  };

  return (
    <ModalWindow top={0} positionFixed>
      <ModalContainer width={86.510417} marginTop={7.592593}>
        <ModalContainerTitle
          title="Missing Tasks"
          closeWindowFunction={closeMissingTasks}
          openNewTab
        />
        <ModalContent>
          {/* <ColoredTable
            height={65}
            tableData={tableData}
            paginationTable
            itemsPerPage={14}
            headTextCenter
            bodyTextCenter
            textColor="#FFF"
            eightyTwentyColumnWidth
            customColumnWidth={columnsWidth}
            loading={loading}
            rowOnClickEvent={rowId => {
              handleOpenTask(rowId);
            }}
          /> */}
          <ColoredTableV2
            data={missingTasks || []}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            itemsPerPage={14}
            loading={loading}
            paginationIsActive
            textColor="#FFF"
            height={65}
            rowSelectionIsActive={false}
            onRowClick={(originalRow) => {
              handleOpenTask(originalRow.id);
            }}
          />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
