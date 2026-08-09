import {
  adminDashboardStore,
  currentSectionStore,
  modalWindowStore,
  numberFormatterStore,
  taskFilterSearchInputStore,
} from '@/store/adminDashboard';
import { useCallback, useEffect, useState } from 'react';
import { Task, Tasks } from '@/app/libs/definitions';
import { Slide } from '&/slide/Slide';
import { TaskFilters } from './taskFilters/TaskFilters';
// import { ColoredTable } from '&/table/coloredTable/ColoredTable';
import { CustomerContactFormat } from '&/miscellaneous/customerContactFormat/CustomerContactFormat';
import { TaskSlideStatusIcon } from '&/miscellaneous/taskSlideStatusIcon/TaskSlideStatusIcon';
import { CustomerTemperatureIcon } from '&/miscellaneous/customerTemperatureIcon/CustomerTemperatureIcon';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { ManagerTaskIcon } from '&/miscellaneous/managerTaskIcon/ManagerTaskIcon';
import { dateFormatsStore, timeSpansStore } from '@/store/dateFormats';
import { pdfDataStore } from '@/store/pdfData';
import { useSession } from 'next-auth/react';
import { stringFormatStore } from '@/store/stringFormat';
import { useSocketStore } from '@/store/socketIo';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { taskFilterStore } from '@/store/tasksHandling';

export function TasksCard() {
  // ----- global states -----

  const { data: session } = useSession();

  const userId = session?.user.id;

  const { tasks } = adminDashboardStore();
  const { getTasks } = adminDashboardStore();
  const openTaskDetail = modalWindowStore((store) => store.openTaskDetail);
  const getSingleClientTasks = adminDashboardStore((store) => store.getSingleClientTasks);

  const { taskStatusFilter, setFetching } = taskFilterStore();

  const { openInNewTab } = modalWindowStore();

  const { getCurrentSection } = currentSectionStore();

  const { numberFormatter } = numberFormatterStore();

  const { taskSearchFilterInput, taskStatusFilterChecksboxes, taskBetweenFrom, taskBetweenTo } =
    taskFilterSearchInputStore();

  const {
    setTaskSearchFilterInput,
    setTaskStatusFilterChecksboxes,
    setTaskBetweenFrom,
    setTaskBetweenTo,
  } = taskFilterSearchInputStore();

  const { dateFormatted } = dateFormatsStore();

  const { setPdfName } = pdfDataStore();

  const { removeSpecialCharacters } = stringFormatStore();

  const { numberFilter } = numberFormatterStore();

  const { updateDataWithSocket } = useSocketStore();

  const {
    todaySpan,
    tomorrowSpan,
    previousSpans,
    upcomingSpans,
    quarters,
    days,
    months,
    yesterdaySpan,
    betweenSpans,
  } = timeSpansStore();

  const getPromiseData = useCallback(() => {
    return [getTasks(userId || 0, taskStatusFilter)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskStatusFilter]);

  const { error, loading } = useLoadingGetData(getPromiseData, [userId]);

  useEffect(() => {
    getCurrentSection('Tasks slide');
    setPdfName('Tasks');
  }, [getCurrentSection, setPdfName]);

  useEffect(() => {
    setFetching(loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // ----- local states -----
  const [decisionText, setDecisionText] = useState<string>('');

  const [orderedData, setOrderedData] = useState<typeof tasks>(undefined);

  const [filterInputs, setFilterInputs] = useState<{
    createdDate: string;
    createdDateAlterInput: string;
  }>({
    createdDate: '',
    createdDateAlterInput: '0',
  });

  const [defaultText, setDefaultText] = useState<{
    statusFilter: string;
    createdDateFilter: string;
  }>({
    statusFilter: 'Task Status',
    createdDateFilter: 'Created Date',
  });

  const [previousUpcomingInputs, setPreviousUpcomingInputs] = useState<{
    optionSelectedValue: string;
    optionSelectedName: string;
  }>({
    optionSelectedValue: '',
    optionSelectedName: 'Select',
  });

  const [visibleTaskIds, setVisibleTaskIds] = useState<number[]>([]);

  const [filteredTasks, setFilteredTasks] = useState<Tasks>(undefined);

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      setFilteredTasks(tasks);
    }
  }, [tasks]);

  // handling change event

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    const numberFormat = numberFormatter(value);

    setFilterInputs((prevstate) => ({
      ...prevstate,
      [name]: numberFormat,
    }));
  };

  // handling click events

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value, name } = e.currentTarget;
    const { identity } = e.currentTarget.dataset;

    if (identity === 'createdDateFilter') {
      setFilterInputs((prevState) => ({
        ...prevState,
        createdDate: value,
      }));

      setDefaultText((prevState) => ({
        ...prevState,
        createdDateFilter: name,
      }));
    }

    if (identity === 'taskStatusFilter') {
      setFilterInputs((prevState) => ({
        ...prevState,
        taskStatus: value,
      }));

      setDefaultText((prevstate) => ({
        ...prevstate,
        statusFilter: name,
      }));
    }

    if (identity === 'completedAll') {
      setDecisionText(`Are you sure you want to complete the current ${visibleTaskIds.length} tasks?`);
    }

    if (identity === 'cancelAll') {
      setDecisionText(`Are you sure you want to cancel the current ${visibleTaskIds.length} tasks?`);
    }

    if (identity === 'previousUpcoming') {
      setPreviousUpcomingInputs({
        optionSelectedValue: value,
        optionSelectedName: name,
      });
    }

    if (identity === 'reset') {
      setFilterInputs({
        createdDate: '',
        createdDateAlterInput: '0',
      });

      setDefaultText({
        statusFilter: 'Task Status',
        createdDateFilter: 'Created Date',
      });

      setTaskSearchFilterInput('');

      setTaskStatusFilterChecksboxes('clean');

      setTaskBetweenFrom('');

      setTaskBetweenTo('');
    }
  };

  const { loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const onDecision = async (decision: boolean) => {
    if (decision) {
      if (decisionText.includes('cancel')) {
        const apiUrl = '/api/adminDashboard/cancelAllTasks';

        await makeAsyncFetch({
          apiUrl,
          method: 'PUT',
          permissionForFetch: 11,
          body: { taskIds: visibleTaskIds },
          options: {
            onSuccess: () => {
              updateDataWithSocket('tasks');

              updateDataWithSocket('dailyTotals');
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
          body: { taskIds: visibleTaskIds },
          options: {
            onSuccess: () => {
              updateDataWithSocket('tasks');

              updateDataWithSocket('dailyTotals');
            },
          },
        });

        setDecisionText('');
      }
    } else {
      setDecisionText('');
    }
  };

  // handling filters input data

  const createdDateFilterData = {
    id: 1,
    height: 5,
    width: 10,
    iconTextGap: 0.5,
    onClick: handleClick,
    options: [
      { value: '1', name: 'All', identity: 'createdDateFilter' },
      { value: '2', name: 'Today', identity: 'createdDateFilter' },
      { value: '3', name: 'Tomorrow', identity: 'createdDateFilter' },
      { value: '12', name: 'Yesterday', identity: 'createdDateFilter' },
      { value: '13', name: 'Between', identity: 'createdDateFilter' },
      { value: '4', name: 'Previous', identity: 'createdDateFilter' },
      { value: '5', name: 'Upcoming', identity: 'createdDateFilter' },
      { value: '6', name: 'Occurs in First Quarter', identity: 'createdDateFilter' },
      { value: '7', name: 'Occurs in Second Quarter', identity: 'createdDateFilter' },
      { value: '8', name: 'Occurs in Third Quarter', identity: 'createdDateFilter' },
      { value: '9', name: 'Occurs in Fourth Quarter', identity: 'createdDateFilter' },
      { value: '10', name: 'Last X Days', identity: 'createdDateFilter' },
      { value: '11', name: 'Last X Months', identity: 'createdDateFilter' },
    ],
    optionsBackgroundColor: '#92CEC3',
    optionsHeight: 5,
    optionsNameColor: '#FFF',
    optionsRadius: 0.3,
    optionsWidth: 10,
    defaultText: defaultText.createdDateFilter,
    backgroundColor: '#92CEC3',
    borderRadius: 1.01,
    textColor: '#FFF',
    borderColor: '#FFF',
  };

  const createdDateAlterInputData = {
    label: '',
    name: 'createdDateAlterInput',
    value: filterInputs.createdDateAlterInput,
    type: 'text',
    width: 8,
    onChange: handleChange,
  };

  const previousUpcomingSelectData = {
    defaultText: previousUpcomingInputs.optionSelectedName,
    option: [
      {
        value: '1',
        name: 'week',
        identity: 'previousUpcoming',
      },
      {
        value: '2',
        name: 'month',
        identity: 'previousUpcoming',
      },
      {
        value: '3',
        name: 'quarter',
        identity: 'previousUpcoming',
      },
      {
        value: '4',
        name: 'year',
        identity: 'previousUpcoming',
      },
    ],
  };

  // handling button data

  const buttonData = [
    {
      id: 1,
      identity: 'completedAll',
      onClick: handleClick,
      backgroundColor: '#01A087',
      textColor: '#FFF',
      border: 0.052083,
      borderColor: '#FFF',
      borderRadius: 1.01,
      buttonText: 'Complete All',
      width: 7,
      can: 10,
    },
    {
      id: 2,
      identity: 'cancelAll',
      onClick: handleClick,
      backgroundColor: '#01A087',
      textColor: '#FFF',
      border: 0.052083,
      borderColor: '#FFF',
      borderRadius: 1.01,
      buttonText: 'Cancel All',
      width: 5.5,
      can: 11,
    },
  ];

  let initialColumnsDef = {
    _blank_manager_task: true,
    customer: true,
    customer_contact: true,
    assigned: true,
    deadline: true,
    task_status: true,
    lead_temperature: true,
  };

  const columnRenderers: {
    [key in keyof typeof initialColumnsDef]: (
      el: Task,
    ) => React.ReactNode | string | number | boolean | Date;
  } = {
    _blank_manager_task: (el) => (el.manager_task ? <ManagerTaskIcon /> : null),
    customer: (el) => (
      <CustomerName
        customer={
          el.customer?.first_name ? `${el.customer?.first_name} ${el.customer?.last_name}` : ''
        }
        customerId={el.customer?.id}
      />
    ),
    customer_contact: (el) => (
      <CustomerContactFormat
        contact={el.customer?.mobile_phone}
        customerId={el.customer?.id}
        marginInlineAuto
      />
    ),
    assigned: (el) => `${el.assigned?.name || ''} ${el.assigned?.last_name || ''}`,
    deadline: (el) => dateFormatted(3, el.deadline),
    task_status: (el) => (
      <TaskSlideStatusIcon statusId={el.status} status={el.task_status?.status} />
    ),
    lead_temperature: (el) => (
      <CustomerTemperatureIcon temperatureId={el.customer?.lead_temperature_id || undefined} />
    ),
  };

  const accessorFnMapper: {
    [key in keyof typeof initialColumnsDef]?: (
      el: Task,
    ) => React.ReactNode | string | number | boolean | Date;
  } = {
    _blank_manager_task: (row) => (row.manager_task ? 'Manager' : ''),
    customer: (row) =>
      row.customer?.first_name ? `${row.customer?.first_name} ${row.customer?.last_name}` : '',
    customer_contact: (row) => row.customer?.mobile_phone || '',
    assigned: (row) => `${row.assigned?.name || ''} ${row.assigned?.last_name || ''}`,
    deadline: (row) => row.deadline,
    lead_temperature: (row) => row.customer?.client_lead_temperature?.temperature || '',
    task_status: (row) => row.task_status?.status,
  };

  const { columns, columnVisibility } = useDynamicTableColumns<Task, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnStyles: { _blank_manager_task: { size: 50 }, task_status: { size: 110 } },
    hideHeaderFor: ['_blank_manager_task'],
    columnRenderers,
    accessorFnMapper,
    filterableColumns: [
      'customer',
      'customer_contact',
      'assigned',
      'deadline',
      'task_status',
      'lead_temperature',
    ],
    columnDataTypes: {
      deadline: 'date',
    },
  });

  useEffect(() => {
    if (filteredTasks && filteredTasks.length > 0) {
      // Función auxiliar para asignar una prioridad numérica a cada tarea
      const getTaskPriority = (task: any) => {
        if (task.manager_task && task.status === 1) return 1; // Prioridad 1 / manager task pending
        if (task.manager_task && task.status === 4) return 2; // Prioridad 2 / manager task late
        if (!task.manager_task && task.status === 1) return 3; // Prioridad 3 / pending
        if (!task.manager_task && task.status === 4) return 4; // Prioridad 4 / late
        if (task.manager_task) return 5; // Prioridad 5 (otros estados)
        return 6; // Prioridad 6 (!manager_task y otros estados)
      };

      // Ordena la lista de tareas usando la función de prioridad
      const sortedData = [...filteredTasks].sort((taskOne, taskTwo) => {
        // 1. Obtenemos la prioridad de cada tarea
        const priorityOne = getTaskPriority(taskOne);
        const priorityTwo = getTaskPriority(taskTwo);

        // 2. Comparamos las prioridades. Un número más bajo va primero.
        if (priorityOne < priorityTwo) {
          return -1;
        }
        if (priorityOne > priorityTwo) {
          return 1;
        }

        // 3. Si las prioridades son iguales, usamos la fecha como desempate
        // (la tarea con el deadline más cercano va primero)
        return new Date(taskOne.deadline).getTime() - new Date(taskTwo.deadline).getTime();
      });

      setOrderedData(sortedData);
    } else if (filteredTasks) {
      setOrderedData([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTasks]);

  const filterControl = () => {
    let currentFilteredData = tasks;

    if (taskSearchFilterInput) {
      const valArray = removeSpecialCharacters(taskSearchFilterInput).toLowerCase().split(' ');
      const valFormatted = removeSpecialCharacters(taskSearchFilterInput);

      if (valFormatted) {
        currentFilteredData = currentFilteredData?.filter((el) => {
          const customerName = el.customer?.first_name.toLowerCase();
          const customerLastname = el.customer?.last_name.toLowerCase();
          const customerMobilePhone = el.customer?.mobile_phone;
          const userName = el.assigned?.name?.toLowerCase();
          const userLastname = el.assigned?.last_name?.toLowerCase();
          const customerStatus = el.customer?.client_status?.status?.toLowerCase();
          const customerTemperature =
            el.customer?.client_lead_temperature?.temperature?.toLowerCase();

          return valArray.every(
            (word) =>
              customerName?.includes(word) ||
              customerLastname?.includes(word) ||
              customerMobilePhone?.includes(word) ||
              userName?.includes(word) ||
              userLastname?.includes(word) ||
              customerStatus?.includes(word) ||
              customerTemperature?.includes(word),
          );
        });
      }
    }

    if (taskStatusFilterChecksboxes && taskStatusFilterChecksboxes.length > 0) {
      currentFilteredData = currentFilteredData?.filter((el) =>
        taskStatusFilterChecksboxes.includes(el.status.toString()),
      );
    }

    // filterInputs.createdDate = 1 ----> all tasks
    if (filterInputs.createdDate && filterInputs.createdDate !== '1') {
      const opt = filterInputs.createdDate;
      const alterInputFormatted = numberFilter(filterInputs.createdDateAlterInput);

      switch (opt) {
        // today
        case '2':
          currentFilteredData = currentFilteredData?.filter((el) => {
            const deadline = el.deadline;

            return deadline ? todaySpan(deadline) : null;
          });
          break;

        // tomorrow
        case '3':
          currentFilteredData = currentFilteredData?.filter((el) => {
            const deadline = el.deadline;

            return deadline ? tomorrowSpan(deadline) : null;
          });
          break;

        // yesterday
        case '12':
          currentFilteredData = currentFilteredData?.filter((el) => {
            const deadline = el.deadline;

            return deadline ? yesterdaySpan(deadline) : null;
          });
          break;

        // between
        case '13':
          currentFilteredData = currentFilteredData?.filter((el) => {
            const deadline = el.deadline;

            return deadline ? betweenSpans(taskBetweenFrom, taskBetweenTo, deadline) : null;
          });
          break;

        // previous
        case '4':
          // previous span
          currentFilteredData = currentFilteredData?.filter((el) => {
            const deadline = el.deadline;

            return deadline
              ? previousSpans(previousUpcomingInputs.optionSelectedValue, deadline)
              : false;
          });
          break;

        // upcoming
        case '5':
          // upcoming span
          currentFilteredData = currentFilteredData?.filter((el) => {
            const deadline = el.deadline;

            return deadline
              ? upcomingSpans(previousUpcomingInputs.optionSelectedValue, deadline)
              : false;
          });
          break;

        // first quarter
        case '6':
          currentFilteredData = currentFilteredData?.filter((el) => {
            const deadline = el.deadline;

            return deadline ? quarters(1, deadline) : false;
          });
          break;

        // second quarter
        case '7':
          currentFilteredData = currentFilteredData?.filter((el) => {
            const deadline = el.deadline;

            return deadline ? quarters(2, deadline) : false;
          });
          break;

        // third quarter
        case '8':
          currentFilteredData = currentFilteredData?.filter((el) => {
            const deadline = el.deadline;

            return deadline ? quarters(3, deadline) : false;
          });
          break;

        // fourth quarter
        case '9':
          currentFilteredData = currentFilteredData?.filter((el) => {
            const deadline = el.deadline;

            return deadline ? quarters(4, deadline) : false;
          });
          break;

        // last x days
        case '10':
          currentFilteredData = currentFilteredData?.filter((el) => {
            const deadline = el.deadline;

            return deadline ? days(alterInputFormatted, deadline) : false;
          });
          break;

        // last x months
        case '11':
          currentFilteredData = currentFilteredData?.filter((el) => {
            const deadline = el.deadline;

            return deadline ? months(alterInputFormatted, deadline) : false;
          });
          break;
      }
    }

    setFilteredTasks(currentFilteredData);
  };

  useEffect(() => {
    filterControl();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    taskSearchFilterInput,
    filterInputs,
    previousUpcomingInputs,
    taskStatusFilterChecksboxes,
    taskBetweenFrom,
    taskBetweenTo,
  ]);

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
    <Slide
      title="Task"
      paddingInline={2}
      paddingTop={3}
      decisionMessage={decisionText}
      loadingConfirmation={loading || loadingFetch}
      onDecision={onDecision}
    >
      <TaskFilters
        buttonData={buttonData}
        createdDate={createdDateFilterData}
        createdDateAlterInput={createdDateAlterInputData}
        previousUpcomingOptions={previousUpcomingSelectData}
      />
      {/* <ColoredTable
        height={49}
        textColor="#FFF"
        tableData={tableData}
        paginationTable
        itemsPerPage={8}
        bodyTextCenter
        headTextCenter
        printButton
        loading={loading}
        rowOnClickEvent={rowId => {
          handleOpenTask(rowId);
        }}
      /> */}
      <ColoredTableV2
        data={orderedData || []}
        columns={columns}
        initialColumnsDef={columnVisibility}
        itemsPerPage={8}
        loading={loading}
        onVisibleDataChange={(data) => {
          setVisibleTaskIds(data.map((task) => task.id));
        }}
        paginationIsActive
        textColor="#FFF"
        paginationTextColor="#FFF"
        height={49}
        rowSelectionIsActive={false}
        // headerTextCenter
        // headerBorder
        printButtonIsActive={true}
        onRowClick={(originalRow) => {
          const rowId = originalRow.id;
          handleOpenTask(rowId);
        }}
      />
    </Slide>
  );
}
