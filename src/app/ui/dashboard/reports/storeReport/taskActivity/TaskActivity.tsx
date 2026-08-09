import { useCallback, useState } from 'react';
import { CloseWindow } from '@/app/libs/definitions';
import { adminDashboardStore, messagesStore, modalWindowStore } from '@/store/adminDashboard';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { useSession } from 'next-auth/react';
import { useDynamicTableColumns } from '&/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '&/table/coloredTable/v2';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { CustomerInfoColumn } from './customerInfoColumn/CustomerInfoColumn';
import { dateFormatsStore } from '@/store/dateFormats';
import { TaskStatus } from './taskStatus/TaskStatus';
import { FilterableField } from '@/store/customerList/types';
import { ExtraTitleButtonsReports } from '&/miscellaneous/extraTitleButtonsReports/ExtraTitleButtonsReports';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useSocketStore } from '@/store/socketIo';
import { Can } from '&/auth/Can';
import { Input } from '&/inputs/Input';
import { ConfirmNotification } from '&/notifications/Notification';
import { TextAreaInput } from '&/inputs/TextAreaInput';
import { TaskActivityData } from '@/app/api/reports/storeReport/taskActivity/types';
import { FilterGroupV2 } from '@/app/ui/miscellaneous/filterGroup/FilterGroupV2';
import { reportsFiltersStore, transformDateToQuery } from '@/store/filtersHandling';
import { buildDateQueryString } from '@/app/libs/buildDatePrismaFilter';

export function TaskActivity({ closeWindow }: CloseWindow) {
  // ----- global states -----

  const { data: session } = useSession();

  const userId = session?.user.id;

  const { tasksActivity } = adminDashboardStore();
  const { getTasksActivity } = adminDashboardStore();

  const { clearFilters, applyFilter } = reportsFiltersStore();

  const openTaskDetail = modalWindowStore((store) => store.openTaskDetail);
  const getSingleClientTasks = adminDashboardStore((store) => store.getSingleClientTasks);

  const { openInNewTab } = modalWindowStore();

  const createDate = reportsFiltersStore((store) => store.createDate);
  const dueDate = reportsFiltersStore((store) => store.dueDate);

  const getPromiseData = useCallback(() => {
    const resultForQuery = transformDateToQuery(createDate);
    const dateQuery = resultForQuery ? buildDateQueryString(resultForQuery) : null;

    const resultForQueryDueDate = transformDateToQuery(dueDate);
    const dateQueryDueDate = resultForQueryDueDate
      ? buildDateQueryString(resultForQueryDueDate, 'Due')
      : null;

    if (
      resultForQuery?.optionDate === '13' &&
      (!resultForQuery.fromDate || !resultForQuery.toDate)
    ) {
      return [];
    }

    const options = ['4', '5', '10', '11'];
    if (
      options.includes(resultForQuery?.optionDate || '0') &&
      (!resultForQuery?.valueDate || resultForQuery?.valueDate === '0')
    ) {
      return [];
    }

    if (
      resultForQueryDueDate?.optionDate === '13' &&
      (!resultForQueryDueDate.fromDate || !resultForQueryDueDate.toDate)
    ) {
      return [];
    }

    if (
      options.includes(resultForQueryDueDate?.optionDate || '0') &&
      (!resultForQueryDueDate?.valueDate || resultForQueryDueDate?.valueDate === '0')
    ) {
      return [];
    }

    return [getTasksActivity(userId, dateQuery, dateQueryDueDate)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createDate, dueDate]);

  const { loading } = useLoadingGetData(getPromiseData);

  const { dateFormatted } = dateFormatsStore();

  const { updateDataWithSocket } = useSocketStore();

  const { setMessages } = messagesStore();

  // ----- local states -----

  const [showFilter, setShowFilter] = useState(true);

  const [reloading, setReloading] = useState(false);

  const handleCloseWindow = () => {
    closeWindow(false);
  };

  type TasksArray = Exclude<TaskActivityData[], undefined>;

  type TasksItem = TasksArray[number];

  const columnRenderers: { [key: string]: (el: TasksItem) => any } = {
    customer_info: (el) => (
      <CustomerInfoColumn
        email={el.customerEmail}
        fullname={el.customerFullName}
        phoneNumber={el.customerPhoneNumber}
        subject={el.taskSubject}
        customerId={el.customerId}
      />
    ),
    sales_rep_assigned: (el) => el.salesRepName,
    due_date: (el) => dateFormatted(2, el.taskDueDate),
    task_status: (el) => <TaskStatus statusId={el.taskStatusId} />,
  };

  let initialColumnsDef = {
    customer_info: true,
    sales_rep_assigned: true,
    due_date: true,
    task_status: true,
  };

  const { columns } = useDynamicTableColumns<TasksItem, typeof initialColumnsDef>({
    initialColumnsDef,
    columnRenderers,
    excludeKeys: ['id'],
    accessorFnMapper: {
      customer_info: (el) => el.customerFullName,
      sales_rep_assigned: (el) => el.salesRepName,
      due_date: (el) => el.taskDueDate,
      task_status: (el) => el.taskStatusId,
    },
  });

  const filterableFields: FilterableField[] = [
    { id: 'customerFullName', label: 'Customer Name', type: 'text' },
    { id: 'customerPhoneNumber', label: 'Customer Phone', type: 'text' },
    { id: 'taskSubject', label: 'Task Subject', type: 'text' },
    { id: 'salesRepName', label: 'Sales Rep', type: 'text' },
    { id: 'taskDueDate', label: 'Due Date', type: 'date' },
    { id: 'taskStatusId', label: 'Task Status', type: 'number' },
  ];

  const filteredData = applyFilter(tasksActivity, {
    salesRep: 'salesRepId',
    customerFullName: 'customerFullName',
    taskStatus: 'taskStatusId',
  });

  const reloadHandling = async () => {
    setReloading(true);

    await getTasksActivity(userId);

    setReloading(false);
  };

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

  const [decisionText, setDecisionText] = useState('');
  const [note, setNote] = useState('');

  const handleClick = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.currentTarget;

    if (name === 'completeAll') {
      setDecisionText('Are you sure you want to complete all current tasks?');
    }

    if (name === 'cancelAll') {
      setDecisionText('Are you sure you want to cancel all current tasks?');
    }
  };

  const buttonData = [
    {
      id: 1,
      name: 'completeAll',
      value: '',
      buttonText: 'Complete All',
      onChange: handleClick,
      can: 10,
    },
    {
      id: 2,
      name: 'cancelAll',
      value: '',
      buttonText: 'Cancel All',
      onChange: handleClick,
      can: 11,
    },
  ];

  const { loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const onDecision = async (decision: boolean) => {
    if (decision) {
      if (!note) {
        setMessages('Please add a note');

        return;
      }

      if (decisionText.includes('cancel')) {
        const apiUrl = '/api/adminDashboard/cancelAllTasks';

        await makeAsyncFetch({
          apiUrl,
          method: 'PUT',
          permissionForFetch: 11,
          options: {
            onSuccess: () => {
              updateDataWithSocket('tasks');

              updateDataWithSocket('dailyTotals');

              setNote('');
            },
          },
        });

        setDecisionText('');
      }

      if (decisionText.includes('complete')) {
        const apiUrl = '/api/adminDashboard/acceptAllTasks';

        await makeAsyncFetch({
          apiUrl,
          method: 'PUT',
          permissionForFetch: 10,
          options: {
            onSuccess: () => {
              updateDataWithSocket('tasks');

              updateDataWithSocket('dailyTotals');

              setNote('');
            },
          },
        });

        setDecisionText('');
      }
    } else {
      setDecisionText('');
    }
  };

  return (
    <ModalWindow>
      <ConfirmNotification notiMessage={decisionText} onDecision={onDecision}>
        <TextAreaInput
          label=""
          name=""
          width={0}
          widthFull
          value={note}
          height={10}
          onChange={(e) => setNote(e.currentTarget.value)}
        />
      </ConfirmNotification>
      <ModalContainer width={97.395833} marginTop={7}>
        <ModalContainerTitle
          title="Task Activity"
          closeWindowFunction={() => {
            clearFilters();

            handleCloseWindow();
          }}
          extraTitleComponent={
            <ExtraTitleButtonsReports
              isFilterVisible={showFilter}
              filterableFields={filterableFields}
              filterToggle={() => setShowFilter(!showFilter)}
              reloadData={reloadHandling}
            />
          }
        />
        <ModalContent>
          {showFilter && (
            <ButtonContainer marginTop={0} marginBottom={1.5} widthFull>
              <FilterGroupV2
                availableFilters={{
                  customerName: true,
                  createDate: true,
                  salesRep: true,
                  dueDate: true,
                  taskStatus: true,
                }}
                advancedFilterFields={filterableFields}
              />
            </ButtonContainer>
          )}
          <section className="relative">
            <aside className="absolute bottom-[100%] flex flex-row gap-[1vw] mb-[1vh] mt-[1vh]">
              {buttonData.map((el, index) => (
                <Can key={`completecancelall%%${el.id}---${index}`} requiredPermission={el.can}>
                  <Input
                    label=""
                    width={0}
                    chekcboxText={el.buttonText}
                    customCheckbox
                    type="checkbox"
                    name={el.name}
                    value={el.value}
                    onChange={el.onChange}
                  />
                </Can>
              ))}
            </aside>
            <ColoredTableV2
              data={filteredData}
              columns={columns}
              itemsPerPage={8}
              paginationIsActive
              textColor="#FFF"
              height={63.2}
              rowSelectionIsActive={false}
              headerTextCenter
              headerBorder
              loading={loading || reloading || loadingFetch}
              printButtonIsActive
              onRowClick={(originalRow) => {
                const rowId = originalRow.taskId;
                handleOpenTask(rowId);
              }}
            />
          </section>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
