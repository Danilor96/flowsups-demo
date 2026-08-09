/* eslint-disable @next/next/no-img-element */
import { CalendarNotiIcon, ThreeDotsNotiIcon, TrashNotiDeleteIcon } from '&/icons/Icons';
import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { ConfirmNotification } from '&/notifications/Notification';

export function Appointments({
  user,
  message,
  sendDate,
  customer,
  notiId,
  isRead,
  appointmentId,
  taskId,
}: {
  user?: string | null;
  message: string;
  sendDate: Date;
  customer?: string | null;
  notiId: number | undefined;
  isRead: boolean | undefined;
  appointmentId: number | null;
  taskId: number | null;
}) {
  const session = useSession();

  const userId = session.data?.user.id;

  const roleId = session.data?.user.user_has[0].role_id;

  const userAltName = `${session.data?.user.name} ${session.data?.user.last_name}`;

  // global states
  const { 
    optimisticMarkAsRead, 
    optimisticDelete, 
    restoreNotification,
    getSingleClientTasks 
  } = adminDashboardStore();

  const { 
    showNotiOptions, 
    openCloseCallendarAppointmentDetail,
    openTaskDetail 
  } = modalWindowStore();
  const { setShowNotiOptions } = modalWindowStore();

  // local states
  const [showOptions, setShowOptions] = useState(false);
  const [disabledInput, setDisabledInput] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const handleNotiOption = async (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    setDisabledInput(true);

    const { notidelete, read, unread } = e.currentTarget.dataset;

    const formData = new FormData();

    // checkboxes
    if (e.currentTarget instanceof HTMLInputElement) {
      const { checked } = e.currentTarget;

      // read
      if (read && checked) {
        formData.append('option', 'read');
      }

      // unread
      if (unread && checked) {
        formData.append('option', 'unread');
      }

      try {
        // Optimistic update
        if (notiId) {
          if (read && checked) optimisticMarkAsRead(notiId, true, 2); // 2 = Appointments
          if (unread && checked) optimisticMarkAsRead(notiId, false, 2);
        }

        // Close UI immediately
        setShowConfirmation(false);
        setShowOptions(false);
        setShowNotiOptions(false);

        const res = await (
          await fetch(`/api/adminDashboard/notifications/${notiId}`, {
            method: 'PUT',
            body: formData,
          })
        ).json();
        // Check for logic failure
        if (!res.successMessage) throw new Error('Failed to update');
      } catch (error) {
        // Precise Rollback
        if (notiId) {
          // Revert to original state
          if (read && checked) optimisticMarkAsRead(notiId, false, 2);
          if (unread && checked) optimisticMarkAsRead(notiId, true, 2);
        }
      }
    }

    // delete button
    if (e.currentTarget instanceof HTMLButtonElement) {
      if (notidelete) {
        setShowConfirmation(true);
      }
    }

    setDisabledInput(false);
  };

  const handleUserDecision = async (decision: boolean) => {
    if (decision) {
      let deletedItem: any;
      try {
        // Optimistic update
        if (notiId) deletedItem = optimisticDelete(notiId, 2); 

        // Close UI
        setShowConfirmation(false);
        setShowOptions(false);
        setShowNotiOptions(false);

        const res = await (
          await fetch(`/api/adminDashboard/notifications/${notiId}`, {
            method: 'DELETE',
          })
        ).json();

        // Explain failure
        if (!res.successMessage) throw new Error('Failed to delete');

      } catch (error) {
         // Precise Rollback
         if (deletedItem) restoreNotification(deletedItem, 2);
      }
    } else {
      setShowConfirmation(false);
    }
  };

  useEffect(() => {
    if (!showNotiOptions) {
      setShowOptions(false);
    }
  }, [showNotiOptions]);

  return (
    <>
      <section className="relative w-full flex flex-row items-center gap-[1.5vw] mt-[2.037037vh]">
        {/* confirmation action notification */}
        {showConfirmation && (
          <ConfirmNotification
            notiMessage="Are you sure you want to delete this notification?"
            onDecision={handleUserDecision}
          />
        )}
        {/* 1 */}
        <div
          onClick={() => {
            if (appointmentId) {
              openCloseCallendarAppointmentDetail(appointmentId.toString());
            } else if (taskId) {
              getSingleClientTasks(taskId.toString());
              openTaskDetail();
            }
          }}
          className="flex flex-row items-center gap-[1.5vw] w-full cursor-pointer"
        >
          <CalendarNotiIcon />
          {/* 2 */}
          <div className="w-full flex flex-col gap-[1.574074vh]">
            <p className="text-[1.666667vh] font-normal text-[#676363]">
              <span className="font-bold">{user ? `@${user}` : `@${userAltName}`}</span> {message}{' '}
              <span className="font-bold">{customer && `@${customer}`}</span>
            </p>
            <p className="text-[1.388889vh] font-normal text-[#959595]">
              {new Date(sendDate).toLocaleString('en-US', {
                weekday: 'long',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            {!isRead && (
              <p className="absolute right-[4vw] top-[-1.5vh] w-[1vw] h-[1vw] text-[1.5vh] text-[#FFF] bg-red-500 rounded-full flex justify-center items-center">
                !
              </p>
            )}
          </div>
        </div>
        {/* 3 */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            setShowOptions(!showOptions);
            setShowNotiOptions(!showNotiOptions);
          }}
          className="w-[3.5vw] h-[2.5vw] rounded-full flex justify-center items-center shadow-crmFormShadow"
        >
          <ThreeDotsNotiIcon />
        </motion.button>
        {/* modal options */}
        <AnimatePresence>
          {showOptions && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-[4vw] top-[3vh] z-30 w-[13.802083vw] bg-[#FFF] py-[1.4vh] flex flex-col gap-[3.219444vh] rounded-[0.520833vw] shadow-crmFormShadow"
            >
              {/* 1 */}
              {!isRead && (
                <aside className="w-[11.197917vw] mx-auto flex flex-row gap-[0.653646vw]">
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    data-read={true}
                    disabled={disabledInput}
                    className="accent-[#00A78B]"
                    onChange={handleNotiOption}
                  />
                  <p className="text-[1.666667vh] font-medium text-[#00A78B]">Mark as Read</p>
                </aside>
              )}
              {/* 2 */}
              {isRead && (
                <aside className="w-[11.197917vw] mx-auto flex flex-row gap-[0.653646vw]">
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    data-unread={true}
                    disabled={disabledInput}
                    className="accent-[#00A78B]"
                    onChange={handleNotiOption}
                  />
                  <p className="text-[1.666667vh] font-medium text-[#00A78B]">Mark as Unread</p>
                </aside>
              )}
              {/* 3 */}
              <motion.button
                onClick={handleNotiOption}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                data-notidelete={true}
                disabled={disabledInput}
                className="w-[11.197917vw] mx-auto flex flex-row gap-[0.653646vw]"
              >
                <TrashNotiDeleteIcon />
                <p className="text-[1.666667vh] font-medium text-[#00A78B]">Delete Notification</p>
              </motion.button>
            </div>
          )}
        </AnimatePresence>
      </section>
      <div className="w-full min-h-[0.2vh] bg-[#D2D2D25E]"></div>
    </>
  );
}
