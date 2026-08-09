import { SpecificClients, Task } from '@/app/libs/definitions';
import { PlusIcon, StarIcon } from '&/icons/Icons';
import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { AnimatePresence } from 'framer-motion';
import { AddManagerTask } from '&/dashboard/managerTask/AddManagerTask';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { useEffect, useState } from 'react';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { VehicleFormat } from '@/app/ui/miscellaneous/vehicleFormat/VehicleFormat';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { IndeterminateCheckbox } from '@/app/ui/table/coloredTable/v2/SelectionColumn';
import { NoteButton } from '@/app/ui/miscellaneous/callDetailSubTable/table/noteButton/NoteButton';
import { DateFormats } from '@/app/ui/miscellaneous/dateFormats/DateFormats';


export function PendingToFound({ customerData }: { customerData: SpecificClients }) {
  // ----- global states -----

  const openClosePendingToFund = modalWindowStore(store => store.openClosePendingToFund);
  const { formatPhoneNumber } = phoneNumbersFormatStore();
  const openTaskDetail = modalWindowStore(store => store.openTaskDetail);
  const getSingleClientTasks = adminDashboardStore(store => store.getSingleClientTasks);
  const openInNewTab = modalWindowStore(store => store.openInNewTab);

  // ----- local states -----
  const [showAddBankTask, setShowAddBankTask] = useState(false);
  const [forManagerTask, setForManagerTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<number[]>([]);

  const handleBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'addManagerTask') {
      setForManagerTask(true);
      setShowAddBankTask(true);
    }

    if (identity === 'addBankTask') {
      setForManagerTask(false);
      setShowAddBankTask(true);
    }

    if (identity === 'save') {
      handleSave();
    }
  };

  const [tableData, setTableData] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);

  const initialColumnsDef = {
    check: true,
    _blank_no_se: true,
    requirement: true,
    assigned_to: true,
    due_date: true,
    note: true,
  };

  const handleSave = async () => {
    setLoadingSave(true);
    setLoading(true);
    try {
      const response = await fetch(`/api/adminDashboard/tasks/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskIds: selectedTask }),
      });

      const resJson = await response.json();

      if (resJson.successMessage) {
        openClosePendingToFund();
      }
      setLoadingSave(false);
      setLoading(false);
    } catch (error) {
      setLoadingSave(false);
      console.log(error);
    }
  };

  const handleCheck = (id: number, checked: boolean) => {
    if (checked) {
      console.log(id, 'checked');
      setSelectedTask(prev => [...prev, id]);
    } else {
      console.log(id, 'unchecked');
      setSelectedTask(prev => prev.filter(el => el !== id));
    }
  };

  const columnsRenderers: { [key in keyof typeof initialColumnsDef]?: (el: Task) => any } = {
    check: el => (
      <IndeterminateCheckbox
        // checked={selectedTask.includes(el.id) || el.status_id === 2} // completed
        defaultChecked={selectedTask.includes(el.id) || el.status === 2}
        onChange={e => {
          handleCheck(el.id, e.currentTarget.checked);
        }}
      />
    ),
    _blank_no_se: el => (el.manager_task ? <StarIcon /> : ''),
    due_date: el => (el.deadline ? <DateFormats date={el.deadline} format={2} /> : ''),
    note: el => <NoteButton notes={(el as any).notes || []} />,
  };

  const { columns } = useDynamicTableColumns<Task, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    hideHeaderFor: ['_blank_no_se'],
    columnRenderers: columnsRenderers,
    accessorFnMapper: {
      check: el => el.id,
      _blank_no_se: el => (el.manager_task ? 'Manager' : ''),
      requirement: el => el.title,
      assigned_to: el => `${el.assigned?.name} ${el.assigned?.last_name}`,
      due_date: el => el.deadline,
      note: el => <NoteButton notes={(el as any).notes || []} />,
    },
    disabledSortColumns: ['check', '_blank_no_se'],
    columnStyles: { _blank_no_se: { size: 50 }, check: { size: 50 } },
  });

  const buttonData = [
    {
      key: 1,
      btnText: 'Add Bank Task',
      backgroundColor: '#FFF',
      identity: 'addBankTask',
      textColor: '#00A78B',
      border: 0.104167,
      borderColor: '#00A78B',
      buttonIcon: <PlusIcon />,
      width: 10.46875,
      iconTextGap: 0.5,
    },
    {
      key: 2,
      btnText: 'Add Manager Task',
      backgroundColor: '#FFF',
      identity: 'addManagerTask',
      textColor: '#00A78B',
      border: 0.104167,
      borderColor: '#00A78B',
      buttonIcon: <PlusIcon />,
      width: 12,
      iconTextGap: 0.5,
    },
    {
      key: 3,
      btnText: 'Save',
      backgroundColor: '#00A78B',
      identity: 'save',
      textColor: '#FFF',
      // onclick: handleSave,
      loading: loadingSave,
    },
  ];

  const fetchTaskData = async (filter: object | null) => {
    const clientId = customerData && customerData.length > 0 ? customerData[0].id : null;
    try {
      if (!clientId) return;
      setLoading(true);
      const dateQueryString = undefined; // buildDateQueryString(filter);
      const response = await fetch(`/api/adminDashboard/singleClient/${clientId}/taskList`);
      const data = (await response.json()) as {
        data: Task[];
      };
      setTableData(data.data);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching activity counts:', error);
    }
  };

  useEffect(() => {
    fetchTaskData(null);
  }, []);

  const handleOpenTask = (taskId: number): void => {
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
    <ModalWindow positionFixed top={0} minSizeFull height={100} overflowYScroll>
      <ModalContainer marginTop={5} width={82.8125}>
        <ModalContainerTitle title="Pending to Fund" closeWindowFunction={openClosePendingToFund} />
        <ModalContent>
          {customerData && customerData.length > 0 && (
            <aside className="flex flex-row items-center gap-[1vw] text-primaryColor w-fit mb-[2vh]">
              <Paragraph color="#00A78B" fontSize={2.4} fontWeight={550}>{`${
                customerData[0].name_lastname || ''
              } ${formatPhoneNumber(customerData[0].mobile_phone)}`}</Paragraph>
              <span>-</span>
              <VehicleFormat interestedVehicle={customerData[0].interested_vehicle} flexRow />
              <span>-</span>
              <Paragraph color="#00A78B" fontSize={2.4} fontWeight={550}>
                {customerData[0].deal && customerData[0].deal.length > 0 ? customerData[0].deal[0].bank?.bank : ''}
              </Paragraph>
            </aside>
          )}
          <ColoredTableV2
            data={tableData}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            itemsPerPage={10}
            loading={loading}
            paginationIsActive
            textColor="#FFF"
            height={55.8}
            rowSelectionIsActive={false}
            onRowClick={originalRow => {
              const rowId = originalRow.id;
              handleOpenTask(rowId);
            }}
          />
          <ButtonContainer marginTop={3} widthFull justify="right" gap={1.5}>
            {buttonData.map((el, index) => (
              <Button
                key={`pendingToFoundBtns--${el.key}cc${index - el.key}`}
                backgroundColor={el.backgroundColor}
                buttonText={el.btnText}
                identity={el.identity}
                textColor={el.textColor}
                border={el.border}
                borderColor={el.borderColor}
                buttonIcon={el.buttonIcon}
                width={el.width}
                iconTextGap={el.iconTextGap}
                buttonTextSize={2}
                onClick={handleBtn}
              />
            ))}
          </ButtonContainer>
        </ModalContent>
        <AnimatePresence>
          {showAddBankTask && (
            <AddManagerTask
              onCloseWindow={() => {
                setShowAddBankTask(false);
              }}
              assignedToIds={
                customerData && customerData?.length > 0 && customerData[0].seller?.id
                  ? [customerData[0].seller?.id.toString()]
                  : undefined
              }
              isTypeBank={!forManagerTask}
              isTypeBankManager={forManagerTask}
              customerId={customerData && customerData?.length > 0 ? customerData[0].id : undefined}
              reloadData={() => fetchTaskData(null)}
            />
          )}
        </AnimatePresence>
      </ModalContainer>
    </ModalWindow>
  );
}
