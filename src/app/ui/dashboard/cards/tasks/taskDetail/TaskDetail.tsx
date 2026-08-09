import { AnimatePresence } from 'framer-motion';
import {
  adminDashboardStore,
  messagesStore,
  modalWindowStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import React, { useCallback, useEffect, useState } from 'react';
import { CompletedTaskDetailWIndow } from '&/dashboard/CompletedtaskDetailWindow';
import { useSession } from 'next-auth/react';
import { SmsModal } from '&/dashboard/clientSystem/clientDetail/smsModal/SmsModal';
import { EmailModal } from '&/dashboard/clientSystem/EmailModal';
import { CustomerDetail } from '&/dashboard/clientSystem/clientDetail/CustomerDetail';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { vehiclesDataStore } from '@/store/inventory';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useSocketStore } from '@/store/socketIo';
import { TaskProcessor } from './taskProcessor/TaskProcessor';
import { TaskContent } from './taskContent/TaskContent';
import { NoteContent } from './taskContent/noteContent/NoteContent';
import { TaskSlideStatusIcon } from '&/miscellaneous/taskSlideStatusIcon/TaskSlideStatusIcon';
import { useCan } from '@/hooks/permissions';

interface InputsType {
  assignedCustomerName: string;
  assignedCustomerId: string;
  interestedVehicleName: string;
  interestedVehicleId: string;
  sellerAssignedName: string;
  sellerAssignedId: string;
  bdcAssignedName: string;
  bdcAssignedId: string;
  managerAssignedName: string;
  managerAssignedId: string;
  financeManagerAssignedName: string;
  financeManagerAssignedId: string;
  followUpDate: string;
  followUpDateTime: string;
  subject: string;
  description: string;
  reminderTimeId: string;
  taskAssignedTo: string[];
}
type InputsTypeKeys = keyof InputsType;

export function TaskDetail({ closeFn }: { closeFn?: () => void }) {
  const session = useSession();
  const userId = session.data?.user.id;

  // ----- global state -----

  const { setMessages } = messagesStore();

  const { closeTaskDetail, openCompletedTaskDetail } = modalWindowStore();

  const { completedTaskDetail, smsModal, emailModal, clientDetailTasks } = modalWindowStore();

  const { getSingleClientData } = singleCLientDataStore();

  const { formatIncomingObjectDate } = inputTypeDateFormatStore();

  const { singleClientTasks, tasks, customerSettings } = adminDashboardStore();
  const {
    clearSingleClientTasks,
    getCustomerSettings,
    getSellers,
    getClients,
    getDayTime,
    getBdc,
    getSalesManagers,
    getFinanceManagers,
    getReminderTime,
    getSingleClientTasks,
  } = adminDashboardStore();

  const getVehiclesData = vehiclesDataStore((store) => store.getVehiclesData);

  const { updateDataWithSocket } = useSocketStore();

  const { can } = useCan();

  const getPromiseData = useCallback(() => {
    return [
      getSellers(),
      getClients(),
      getDayTime(),
      getVehiclesData(),
      getBdc(),
      getSalesManagers(),
      getFinanceManagers(),
      getCustomerSettings(),
      getReminderTime(),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, loading } = useLoadingGetData(getPromiseData);

  // ----- local states -----

  const [noteInput, setNoteInput] = useState('');
  const [inputs, setInputs] = useState<InputsType>({
    assignedCustomerName: '',
    assignedCustomerId: '',
    interestedVehicleName: '',
    interestedVehicleId: '',
    sellerAssignedName: '',
    sellerAssignedId: '',
    bdcAssignedName: '',
    bdcAssignedId: '',
    managerAssignedName: '',
    managerAssignedId: '',
    financeManagerAssignedName: '',
    financeManagerAssignedId: '',
    followUpDate: '',
    followUpDateTime: '',
    subject: '',
    description: '',
    reminderTimeId: '1',
    taskAssignedTo: [],
  });

  const { fieldErrors, loadingFetch, makeAsyncFetch, setManualFieldErrors } = useAsyncFetching();

  const handleUpdateTask = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!inputs.subject || !inputs.description || inputs.taskAssignedTo.length < 1) {
      setManualFieldErrors({
        subject: [!inputs.subject ? 'Required' : undefined],
        description: [!inputs.description || inputs.description === ' ' ? 'Required' : undefined],
        taskAssignedTo: [inputs.taskAssignedTo.length < 1 ? 'Required' : undefined],
      });
      return;
    }

    const formData = new FormData();

    formData.append('assignedCustomerId', inputs.assignedCustomerId);
    formData.append('interestedVehicleId', inputs.interestedVehicleId);
    formData.append('followUpDate', inputs.followUpDate);
    formData.append('subject', inputs.subject);
    formData.append('description', inputs.description);
    formData.append('reminderTimeId', inputs.reminderTimeId);
    formData.append('taskAssignedTo', JSON.stringify(inputs.taskAssignedTo));

    const apiUrl = `/api/adminDashboard/tasks/${singleClientTasks?.id}`;

    await makeAsyncFetch({
      formData,
      apiUrl,
      method: 'PUT',
      options: {
        onSuccess: () => {
          updateDataWithSocket('tasks');

          updateDataWithSocket('taskDetail', undefined, {
            taskId: singleClientTasks?.id?.toString(),
          });

          updateDataWithSocket('dailyTotals');
        },
      },
    });
  };

  useEffect(() => {
    if (singleClientTasks) {
      const taskAssigned = singleClientTasks.assigned;
      const salesRep = singleClientTasks.customer?.seller;
      const bdc = singleClientTasks.customer?.bdc;
      const salesManager = singleClientTasks.customer?.sales_manager;
      const financeManager = singleClientTasks.customer?.finance_manager;

      const interested_vehicle =
        singleClientTasks.customer?.interested_vehicle || singleClientTasks?.interested_vehicle;

      const vehicleName = interested_vehicle
        ? `${interested_vehicle?.vehicle_brands.brand || ''} ${
            interested_vehicle?.vehicle_models.model || ''
          } [${interested_vehicle?.vehicle_identification_numbers.vin.slice(-6)}]`
        : '';

      setInputs({
        assignedCustomerName: singleClientTasks.customer
          ? `${singleClientTasks.customer.first_name} ${
              singleClientTasks.customer.last_name || ''
            }`.trim()
          : '',
        assignedCustomerId: singleClientTasks.customer_id?.toString() || '',
        interestedVehicleName: vehicleName,
        interestedVehicleId: interested_vehicle?.id?.toString() || '',
        sellerAssignedName: salesRep
          ? `${salesRep.name || ''} ${salesRep.last_name || ''}${
              salesRep.username ? ` - ${salesRep.username}` : ''
            }`.trim()
          : '',
        sellerAssignedId: salesRep?.id?.toString() || '',
        bdcAssignedName: bdc
          ? `${bdc.name || ''} ${bdc.last_name || ''}${
              bdc.username ? ` - ${bdc.username}` : ''
            }`.trim()
          : '',
        bdcAssignedId: bdc?.id?.toString() || '',
        managerAssignedName: salesManager
          ? `${salesManager.name || ''} ${salesManager.last_name || ''}${
              salesManager.username ? ` - ${salesManager.username}` : ''
            }`.trim()
          : '',
        managerAssignedId: salesManager?.id?.toString() || '',
        financeManagerAssignedName: financeManager
          ? `${financeManager.name || ''} ${financeManager.last_name || ''}${
              financeManager.username ? ` - ${financeManager.username}` : ''
            }`.trim()
          : '',
        financeManagerAssignedId: financeManager?.id?.toString() || '',
        followUpDate: singleClientTasks.deadline
          ? new Date(singleClientTasks.deadline).toLocaleString('en-US', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '',
        followUpDateTime: singleClientTasks.deadline
          ? new Date(singleClientTasks.deadline).toLocaleString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })
          : '',
        subject: singleClientTasks?.title || '',
        description: singleClientTasks?.description || '',
        reminderTimeId: singleClientTasks.reminder_time_id?.toString() || '',
        taskAssignedTo: taskAssigned?.id ? [taskAssigned.id.toString()] : [],
      });
    }
  }, [singleClientTasks]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.currentTarget;

    const keys = Object.keys(inputs);
    if (
      value === '' &&
      keys.includes(`${name.replace('Name', '')}Name`) &&
      keys.includes(`${name.replace('Name', '')}Id`)
    ) {
      setInputs((prevState) => ({
        ...prevState,
        [name]: '',
        [`${name.replace('Name', '')}Id`]: '',
      }));
      return;
    }

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAssignedSelect = (
    e: React.MouseEvent<HTMLButtonElement>,
    keys: { keyForString: InputsTypeKeys; keyForValue: InputsTypeKeys },
  ) => {
    const { value, name } = e.currentTarget;

    setInputs((prevState) => ({
      ...prevState,
      [keys.keyForString]: name,
      [keys.keyForValue]: value,
    }));
  };

  const handleUsersAssigned = (value: string[]) => {
    setInputs((prevState) => ({
      ...prevState,
      taskAssignedTo: value,
    }));
  };

  const handleDayPick = (e: Date) => {
    setInputs((prevState) => ({
      ...prevState,
      followUpDate: formatIncomingObjectDate(e),
      followUpDateTime: '',
    }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.currentTarget;
    setInputs((prevState) => ({
      ...prevState,
      followUpDateTime: value,
      followUpDate: inputs.followUpDate
        ? `${inputs.followUpDate.split(',')[0]}, ${value}`
        : inputs.followUpDate,
    }));
  };

  const handleSaveNote = async () => {
    if (noteInput == '') {
      setMessages('You must write a note');
      return;
    }

    if (
      singleClientTasks &&
      singleClientTasks.customer &&
      singleClientTasks.customer.id &&
      can(20)
    ) {
      const formData = new FormData();

      formData.append('note', noteInput);
      formData.append('from', '');
      userId && formData.append('created_by', userId?.toString());
      singleClientTasks.customer?.id &&
        formData.append('client_id', singleClientTasks.customer?.id.toString());

      const apiUrl = '/api/adminDashboard/clientsNotes';

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        permissionForFetch: 20,
        options: {
          onSuccess: () => {
            updateDataWithSocket('taskDetail', undefined, {
              taskId: singleClientTasks.id?.toString(),
            });

            setNoteInput('');
          },
        },
      });
    } else if (can(20)) {
      const formData = new FormData();

      formData.append('note', noteInput);
      formData.append('createdById', `${userId}`);
      formData.append('createdAt', new Date().toISOString());
      formData.append('taskId', `${singleClientTasks?.id}`);

      const apiUrl = '/api/adminDashboard/taskNote';

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        permissionForFetch: 20,
        options: {
          onSuccess: () => {
            updateDataWithSocket('taskDetail', undefined, {
              taskId: singleClientTasks?.id?.toString(),
            });

            setNoteInput('');
          },
        },
      });
    }
  };

  const [cancelTaskConfirmationMessage, setCancelTaskConfirmationMessage] = useState('');
  const [completeTaskConfirmationMessage, setCompleteTaskConfirmationMessage] = useState('');
  const [processToNextTask, setProcessToNextTask] = useState(false);
  const [loadingNextTask, setLoadingNextTask] = useState(false);

  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'complete' && can(12)) {
      if (customerSettings && customerSettings.show_followup) {
        openCompletedTaskDetail();

        return;
      }

      setCompleteTaskConfirmationMessage('Are you sure you want to complete this task?');
    }

    if (identity === 'cancel' && can(13)) {
      setCancelTaskConfirmationMessage('Are you sure you want to cancel this task?');
    }
  };

  const handleNextTaskOrder = async () => {
    if (
      processToNextTask &&
      tasks &&
      tasks.length > 0 &&
      userId &&
      singleClientTasks &&
      singleClientTasks.id
    ) {
      const lateAndPendingStatuses = [1, 4]; // 1 = pending, 4 = late

      const currentUserLateAndPendingTasks = tasks.filter((el) => {
        if (el.assigned_to !== userId) {
          return lateAndPendingStatuses.includes(el.status) && el.id !== singleClientTasks.id;
        }

        return (
          el.assigned_to === userId &&
          lateAndPendingStatuses.includes(el.status) &&
          el.id !== singleClientTasks.id
        );
      });

      if (currentUserLateAndPendingTasks && currentUserLateAndPendingTasks.length > 0) {
        let nextTask = currentUserLateAndPendingTasks.find(
          (el) => el.status === singleClientTasks.status,
        );

        if (!nextTask) nextTask = currentUserLateAndPendingTasks.find((el) => el.id);

        if (nextTask) {
          setLoadingNextTask(true);

          getSingleClientTasks(nextTask.id.toString()).finally(() => setLoadingNextTask(false));

          return true;
        }
      }
    }
  };

  const handleDecision = async (decision: boolean) => {
    if (decision) {
      if (cancelTaskConfirmationMessage && can(13)) {
        const formData = new FormData();

        const apiUrl = `/api/adminDashboard/tasks/cancel/${singleClientTasks?.id}`;

        await makeAsyncFetch({
          formData,
          apiUrl,
          method: 'PUT',
          permissionForFetch: 13,
          options: {
            onSuccess: async () => {
              setCancelTaskConfirmationMessage('');

              updateDataWithSocket('tasks');

              updateDataWithSocket('dailyTotals');

              const dontUpdateThis = await handleNextTaskOrder();

              updateDataWithSocket('taskDetail', undefined, {
                taskId: singleClientTasks?.id,
                dontUpdateThis,
              });
            },
          },
        });
      }

      if (completeTaskConfirmationMessage && can(12)) {
        const formData = new FormData();

        const apiUrl = `/api/adminDashboard/tasks/complete/${singleClientTasks?.id}`;

        await makeAsyncFetch({
          formData,
          apiUrl,
          method: 'PUT',
          permissionForFetch: 12,
          options: {
            onSuccess: async () => {
              setCompleteTaskConfirmationMessage('');

              updateDataWithSocket('tasks');

              updateDataWithSocket('dailyTotals');

              const dontUpdateThis = await handleNextTaskOrder();

              updateDataWithSocket('taskDetail', undefined, {
                taskId: singleClientTasks?.id,
                dontUpdateThis,
              });
            },
          },
        });
      }
    } else {
      setCancelTaskConfirmationMessage('');

      setCompleteTaskConfirmationMessage('');
    }
  };

  return (
    <ModalWindow top={0} positionFixed minSizeFull height={100} overflowYScroll>
      <AnimatePresence>{smsModal && <SmsModal />}</AnimatePresence>
      <AnimatePresence>{emailModal && <EmailModal />}</AnimatePresence>
      <AnimatePresence>{clientDetailTasks && <CustomerDetail />}</AnimatePresence>
      <ModalContainer marginTop={4} width={75.541667}>
        <ModalContainerTitle
          title="Task Detail"
          closeWindowFunction={() => {
            // if (closeNewTab) {
            //   window.close();
            // }

            if (closeFn) {
              clearSingleClientTasks();
              closeFn();

              return;
            }

            clearSingleClientTasks();
            getSingleClientData('clear');
            closeTaskDetail();
          }}
          openNewTab
          directOpenUrl={`/dashboard/task-${singleClientTasks?.id}`}
          extraTitleComponent={
            singleClientTasks?.task_status?.status && (
              <TaskSlideStatusIcon
                statusId={singleClientTasks?.status}
                status={singleClientTasks?.task_status.status}
              />
            )
          }
        />
        <ModalContent
          minHeight={85}
          loading={loading || loadingFetch || loadingNextTask}
          decisionMessage={cancelTaskConfirmationMessage || completeTaskConfirmationMessage}
          onDecision={handleDecision}
          loadingConfirmation={loadingFetch}
        >
          <TaskProcessor
            onClick={handleButton}
            onChange={(e) => {
              const { checked } = e.currentTarget;

              setProcessToNextTask(checked);
            }}
          />
          <TaskContent
            inputs={inputs}
            fieldErrors={fieldErrors}
            onChange={handleChange}
            onUpdate={handleUpdateTask}
            onAssignedClick={handleAssignedSelect}
            onDayPick={handleDayPick}
            onTimeChange={handleTimeChange}
            onClickRemoveVehicle={() => {
              setInputs((prevState) => ({
                ...prevState,
                interestedVehicleId: '',
                interestedVehicleName: '',
              }));
            }}
            onUserAssignedClick={handleUsersAssigned}
          />
          <NoteContent
            noteInput={noteInput}
            onChange={can(18) ? (e) => setNoteInput(e.currentTarget.value) : () => {}}
            onClick={handleSaveNote}
          />
        </ModalContent>
      </ModalContainer>
      <AnimatePresence>
        {completedTaskDetail && (
          <CompletedTaskDetailWIndow handleNextTaskOrder={handleNextTaskOrder} />
        )}
      </AnimatePresence>
    </ModalWindow>
  );
}
