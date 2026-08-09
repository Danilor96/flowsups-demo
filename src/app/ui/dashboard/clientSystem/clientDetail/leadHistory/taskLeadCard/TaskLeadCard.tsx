import { TaskStatuses } from '&/dashboard/reports/storeReport/taskActivity/taskStatus/TaskStatus';
import { LeadBackground } from '../leadCard/leadBackground/LeadBackground';
import { AnimatePresence, motion } from 'framer-motion';
import { dateFormatsStore } from '@/store/dateFormats';
import { useState } from 'react';
import { ConfirmNotification } from '&/notifications/Notification';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useCan } from '@/hooks/permissions';
import { Permissions } from '@/app/libs/definitions/permissions/permissions';
import { useSocketStore } from '@/store/socketIo';
import { Can } from '&/auth/Can';
import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { TaskDetail } from '@/app/ui/dashboard/cards/tasks/taskDetail/TaskDetail';
import { EditIcon } from '&/icons/Icons';

export function TaskLeadCard({
  id,
  dueDate,
  statusId,
  subject,
  description,
  assignedTo,
  createdBy,
  createdAt,
  finishedAt,
  fromOptionsLeads,
}: {
  id: number;
  dueDate: Date;
  statusId: number;
  subject: string;
  description: string;
  assignedTo: string;
  createdBy: string;
  createdAt: Date;
  finishedAt?: Date | null;
  fromOptionsLeads?: boolean;
}) {
  // ----- global -----

  const dateFormat = dateFormatsStore((state) => state.dateFormatted);

  const { can } = useCan();

  const updateDataWithSocket = useSocketStore((state) => state.updateDataWithSocket);
  const getSingleClientTasks = adminDashboardStore((store) => store.getSingleClientTasks);
  const taskDetailIsOpen = modalWindowStore((state) => state.taskDetail);

  // ----- local -----

  const [cancelTaskConfirmationMessage, setCancelTaskConfirmationMessage] = useState('');
  const [completeTaskConfirmationMessage, setCompleteTaskConfirmationMessage] = useState('');
  const [currentStatus, setCurrentStatus] = useState(statusId);

  const [showTaskModal, setShowTaskModal] = useState(false);

  const { loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleDecision = async (decision: boolean) => {
    if (decision) {
      if (cancelTaskConfirmationMessage && can(Permissions.TaskDetailCancelTask)) {
        const formData = new FormData();

        const apiUrl = `/api/adminDashboard/tasks/cancel/${id}`;

        await makeAsyncFetch({
          formData,
          apiUrl,
          method: 'PUT',
          permissionForFetch: 13,
          options: {
            onSuccess: async () => {
              setCancelTaskConfirmationMessage('');

              setCurrentStatus(TaskStatuses.Canceled);

              updateDataWithSocket('tasks');

              updateDataWithSocket('dailyTotals');

              updateDataWithSocket('taskDetail', undefined, {
                taskId: id,
              });
            },
          },
        });
      }

      if (completeTaskConfirmationMessage && can(Permissions.TaskDetailComplteTask)) {
        const formData = new FormData();

        const apiUrl = `/api/adminDashboard/tasks/complete/${id}`;

        await makeAsyncFetch({
          formData,
          apiUrl,
          method: 'PUT',
          permissionForFetch: 12,
          options: {
            onSuccess: async () => {
              setCompleteTaskConfirmationMessage('');

              setCurrentStatus(TaskStatuses.Completed);

              updateDataWithSocket('tasks');

              updateDataWithSocket('dailyTotals');

              updateDataWithSocket('taskDetail', undefined, {
                taskId: id,
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

  if (fromOptionsLeads) {
    return (
      <>
        <LeadBackground>
          <ConfirmNotification
            notiMessage={cancelTaskConfirmationMessage || completeTaskConfirmationMessage}
            onDecision={handleDecision}
            loading={loadingFetch}
          />
          <div className="flex flex-col gap-2 relative">
            <section className="flex justify-between items-center p-2">
              <aside className="flex justify-center items-center gap-2">
                <p className="text-sm font-bold text-[#00A78B]">Task</p>
                <p
                  className={`w-fit grid place-content-center p-1 text-xs rounded-md ${
                    currentStatus === TaskStatuses.Completed
                      ? 'bg-[#C9EBE6] text-[#00A78B]'
                      : currentStatus === TaskStatuses.Canceled
                        ? 'bg-[#ED000073] text-[#FFFFFF]'
                        : currentStatus === TaskStatuses.Late
                          ? 'bg-[#e67b16] text-[#FFFFFF]'
                          : 'bg-[#FED979] text-[#A87900]'
                  }`}
                >
                  {TaskStatuses[currentStatus]}
                </p>
              </aside>
              <aside className="flex justify-center items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                  onClick={() => {
                    if (taskDetailIsOpen) return;
                    getSingleClientTasks(id.toString());
                    setShowTaskModal(true);
                  }}
                >
                  <EditIcon />
                </motion.button>
                {currentStatus !== TaskStatuses.Completed && currentStatus !== TaskStatuses.Canceled ? (
                  <>
                    <Can requiredPermission={Permissions.TaskDetailCancelTask}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        className="w-fit grid place-content-center text-white p-2 text-xs rounded-md bg-primaryColor border-2 border-primaryColor"
                        onClick={() => {
                          setCompleteTaskConfirmationMessage('Are you sure you want to complete this task?');
                        }}
                      >
                        Complete
                      </motion.button>
                    </Can>
                    <Can requiredPermission={Permissions.TaskDetailComplteTask}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        className="w-fit grid place-content-center text-primaryColor p-2 text-xs rounded-md bg-white border-2 border-primaryColor"
                        onClick={() => {
                          setCancelTaskConfirmationMessage('Are you sure you want to cancel this task?');
                        }}
                      >
                        Cancel
                      </motion.button>
                    </Can>
                  </>
                ) : (
                  <p className="flex justify-center items-center gap-2 text-xs">
                    <span className="text-slate-600">
                      {currentStatus === TaskStatuses.Completed ? 'Completed At' : 'Canceled At'}
                    </span>
                    <span className="text-primaryColor">{dateFormat(8, finishedAt)}</span>
                  </p>
                )}
              </aside>
            </section>
            <section className="flex flex-col gap-2 p-2 text-xs">
              <aside className="flex justify-between items-center">
                <p className="flex justify-center items-start gap-2">
                  <span className="text-slate-600 text-nowrap">Assigned To</span>
                  <span className="text-primaryColor">{assignedTo}</span>
                </p>
                <p className="flex justify-center items-start gap-2">
                  <span className="text-slate-600 text-nowrap">Due Date</span>
                  <span className="text-primaryColor">{dateFormat(8, dueDate)}</span>
                </p>
              </aside>
              <p className="w-fit flex justify-center items-start gap-2">
                <span className="text-slate-600">Subject</span>
                <span className="text-primaryColor">{subject}</span>
              </p>
            </section>
            <section className="flex flex-col gap-4 p-2 text-xs">
              <p className="text-primaryColor">{description}</p>
              <aside className="w-fit flex justify-center items-start gap-2">
                <p className="flex justify-center items-start gap-2">
                  <span className="text-slate-600">By:</span>{' '}
                  <span className="text-primaryColor">{`${createdBy} - ${dateFormat(8, createdAt)}`}</span>
                </p>
              </aside>
            </section>
          </div>
        </LeadBackground>
        <AnimatePresence>
          {showTaskModal && (
            <TaskDetail
              closeFn={() => {
                setShowTaskModal(false);
              }}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <LeadBackground>
        <ConfirmNotification
          notiMessage={cancelTaskConfirmationMessage || completeTaskConfirmationMessage}
          onDecision={handleDecision}
          loading={loadingFetch}
        />
        <div className="flex flex-col gap-2 relative">
          <section className="flex justify-between items-center p-2">
            <aside className="flex justify-center items-center gap-2">
              <p className="text-xl font-bold text-[#00A78B]">Task</p>
              <p
                className={`w-fit grid place-content-center p-1 rounded-md ${
                  currentStatus === TaskStatuses.Completed
                    ? 'bg-[#C9EBE6] text-[#00A78B]'
                    : currentStatus === TaskStatuses.Canceled
                      ? 'bg-[#ED000073] text-[#FFFFFF]'
                      : currentStatus === TaskStatuses.Late
                        ? 'bg-[#e67b16] text-[#FFFFFF]'
                        : 'bg-[#FED979] text-[#A87900]'
                }`}
              >
                {TaskStatuses[currentStatus]}
              </p>
            </aside>
            <aside className="flex justify-center items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                onClick={() => {
                  if (taskDetailIsOpen) return;
                  getSingleClientTasks(id.toString());
                  setShowTaskModal(true);
                }}
              >
                <EditIcon width="1.7vw" height="2.7vh" />
              </motion.button>
              {currentStatus !== TaskStatuses.Completed && currentStatus !== TaskStatuses.Canceled ? (
                <>
                  <Can requiredPermission={Permissions.TaskDetailCancelTask}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      className="w-fit grid place-content-center text-white p-2 rounded-md bg-primaryColor border-2 border-primaryColor"
                      onClick={() => {
                        setCompleteTaskConfirmationMessage('Are you sure you want to complete this task?');
                      }}
                    >
                      Complete
                    </motion.button>
                  </Can>
                  <Can requiredPermission={Permissions.TaskDetailComplteTask}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      className="w-fit grid place-content-center text-primaryColor p-2 rounded-md bg-white border-2 border-primaryColor"
                      onClick={() => {
                        setCancelTaskConfirmationMessage('Are you sure you want to cancel this task?');
                      }}
                    >
                      Cancel
                    </motion.button>
                  </Can>
                </>
              ) : (
                <p className="flex justify-center items-center gap-2">
                  <span className="text-slate-600">
                    {currentStatus === TaskStatuses.Completed ? 'Completed At' : 'Canceled At'}
                  </span>
                  <span className="text-primaryColor">{dateFormat(8, finishedAt)}</span>
                </p>
              )}
            </aside>
          </section>
          <section className="flex flex-col gap-2 p-2">
            <aside className="flex justify-between items-center">
              <p className="flex justify-center items-center gap-2">
                <span className="text-slate-600">Assigned To</span>
                <span className="text-primaryColor">{assignedTo}</span>
              </p>
              <p className="flex justify-center items-center gap-2">
                <span className="text-slate-600">Due Date</span>
                <span className="text-primaryColor">{dateFormat(8, dueDate)}</span>
              </p>
            </aside>
            <p className="w-fit flex justify-center items-center gap-2">
              <span className="text-slate-600">Subject</span>
              <span className="text-primaryColor">{subject}</span>
            </p>
          </section>
          <section className="flex flex-col gap-4 p-2">
            <p className="text-primaryColor">{description}</p>
            <aside className="w-fit flex justify-center items-center gap-2">
              <p className="flex justify-center items-center gap-2">
                <span className="text-slate-600">By:</span>{' '}
                <span className="text-primaryColor">{`${createdBy} - ${dateFormat(8, createdAt)}`}</span>
              </p>
            </aside>
          </section>
        </div>
      </LeadBackground>
      <AnimatePresence>
        {showTaskModal && (
          <TaskDetail
            closeFn={() => {
              setShowTaskModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
