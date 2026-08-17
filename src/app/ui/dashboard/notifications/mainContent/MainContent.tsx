import { motion } from 'framer-motion';
import {
  AdviceNotiIcon,
  AppointmentNotiIcon,
  CustomerNotiIcon,
  GeneralNotiIcon,
  InventoryNotiIcon,
  MarkAsRead,
} from '&/icons/Icons';
import { Customers } from '&/dashboard/notifications/customers/Customers';
import { General } from '&/dashboard/notifications/general/General';
import { Appointments } from '&/dashboard/notifications/appointments/Appointments';
import { Inventory } from '&/dashboard/notifications/inventory/Inventory';
import { Warning } from '&/dashboard/notifications/warning/Warning';
import { useCallback, useEffect, useRef, useState } from 'react';
import { adminDashboardStore } from '@/store/adminDashboard';
import { useSession } from 'next-auth/react';
import { Loader } from '&/miscellaneous/loader/Loader';
import { dateFormatsStore } from '@/store/dateFormats';

export function MainContent() {
  const session = useSession();
  const userId = session.data?.user.id;
  const roleId = session.data?.user.user_has[0].role_id;
  
  const userAltName = `${session.data?.user.username || session.data?.user.name || ''}`;

  // global states
  const { 
    notifications, 
    notificationCounts, 
    notificationsPagination 
  } = adminDashboardStore();
  const { 
    getNotifications, 
    getTotalNotifications, 
    getNotificationCounts,
    resetNotifications 
  } = adminDashboardStore();

  const { dateFromNotifications } = dateFormatsStore();

  // local states
  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentOpt, setCurrentOpt] = useState(1);
  const scrollContainerRef = useRef<HTMLElement>(null);

  // Map currentOpt to typeId for filtering (1=General, 2=Appointments, 3=Inventory, 4=Customers, 5=Warnings)
  const getTypeIdFromOpt = (opt: number) => opt;

  useEffect(() => {
    if (userId && roleId) {
      getNotificationCounts(userId.toString(), roleId.toString());
      getNotifications({ userId: userId.toString(), roleId: roleId.toString(), page: 1, typeId: getTypeIdFromOpt(currentOpt) })
        .finally(() => setLoading(false));
    }
  }, [getNotifications, getNotificationCounts, userId, roleId]);

  useEffect(() => {
    if (userId && roleId && !loading) {
      setLoadingContent(true);
      resetNotifications();
      getNotifications({ userId: userId.toString(), roleId: roleId.toString(), page: 1, typeId: getTypeIdFromOpt(currentOpt) })
        .finally(() => setLoadingContent(false));
    }
  }, [currentOpt]);

  const handleTotalNumber = (total: number | undefined) => {
    let totalNotifications = total ? total.toString() : '';

    if (totalNotifications && parseInt(totalNotifications) > 10) {
      totalNotifications = '+10';
    }

    return totalNotifications;
  };


  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    if (!userId || !roleId || loadingMore || !notificationsPagination?.hasMore) return;
    
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      setLoadingMore(true);
      const nextPage = notificationsPagination.page + 1;
      getNotifications({
        userId: userId.toString(), 
        roleId: roleId.toString(), 
        page: nextPage, 
        typeId: getTypeIdFromOpt(currentOpt),
        append: true // append to existing notifications
      }).finally(() => setLoadingMore(false));
    }
  }, [userId, roleId, loadingMore, notificationsPagination, currentOpt, getNotifications]);

  const handleOptChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    const opt = e.currentTarget.closest('button')?.dataset.opt;
    if (opt && parseInt(opt) !== currentOpt) {
      setCurrentOpt(parseInt(opt));
    }
  };

  const handleMarkAllNotiAsRead = async () => {
    try {
      const res = await (
        await fetch(`/api/adminDashboard/markAllNotiAsread/${userId}`, { method: 'PUT' })
      ).json();

      if (res.successMessage) {
        if (userId && roleId) {
          getNotificationCounts(userId.toString(), roleId.toString());
          resetNotifications();
          getNotifications({ userId: userId.toString(), roleId: roleId.toString(), page: 1, typeId: getTypeIdFromOpt(currentOpt) });
          getTotalNotifications(userId, roleId);
        }
      }
    } catch (error) {}
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute left-[-25vw] top-[100%] mt-[2.5vh] z-10 w-[40vw] h-[59.259259vh] rounded-[0.520833vw] bg-[#FFF] shadow-crmFormShadow max-lg:fixed max-lg:left-0 max-lg:right-0 max-lg:bottom-0 max-lg:top-auto max-lg:mt-0 max-lg:w-full max-lg:h-[85vh] max-lg:max-h-[85vh] max-lg:rounded-t-xl"
    >
      {/* main container */}
      <div className="w-[90%] h-[90%] mx-auto mt-[2.3vh] flex flex-col max-lg:w-full max-lg:h-full max-lg:mt-0 max-lg:px-2 max-lg:py-2">
        {/* first row */}
        <aside className="flex justify-between">
          <p className="text-[2.1296296vh] font-bold text-[#00A78B]">Notifications</p>
          <motion.button onClick={handleMarkAllNotiAsRead} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <p className="text-[1.388889vh] font-normal text-[#00A78B] flex flex-row gap-[0.5vw]">
              <span>
                <MarkAsRead />
              </span>{' '}
              Mark all as Read
            </p>
          </motion.button>
        </aside>
        {/* second row */}
        <aside className="w-full h-[5.092593vh] flex flex-row justify-between items-center mt-[3.148148vh] rounded-[0.520833vw] bg-[#C9EBE6] px-[0.5vw] max-lg:h-auto max-lg:mt-2 max-lg:overflow-x-auto max-lg:whitespace-nowrap">
          <button
            onClick={e => handleOptChange(e)}
            type="button"
            data-opt={1}
            className={`w-fit px-[0.5vw] relative h-full ${currentOpt === 1 && 'bg-[#FFF] border-b-[0.32vh] border-[#00A78B]'}`}
          >
            <p className="w-fit flex items-center flex-row gap-[0.5vw] text-[1.666667vh] font-normal text-[#00A78B]">
              General
              <span>
                <GeneralNotiIcon />
              </span>
            </p>
            {notificationCounts.general > 0 && (
              <p className="absolute top-[-2.25vh] right-0 left-0 mx-auto w-[1.5vw] h-[1.5vw] bg-red-500 rounded-full text-[1.7vh] text-[#FFF] flex justify-center items-center">
                {handleTotalNumber(notificationCounts.general)}
              </p>
            )}
          </button>
          <article className="w-[0.01vw] h-[80%] bg-[#003221]"></article>
          <button
            onClick={e => handleOptChange(e)}
            data-opt={2}
            type="button"
            className={`w-fit px-[0.5vw] relative h-full ${currentOpt === 2 && 'bg-[#FFF] border-b-[0.32vh] border-[#00A78B]'}`}
          >
            <p className="w-fit flex items-center flex-row gap-[0.5vw] text-[1.666667vh] font-normal text-[#00A78B]">
              Appointments
              <span>
                <AppointmentNotiIcon />
              </span>
            </p>
            {notificationCounts.appointment > 0 && (
              <p className="absolute top-[-2.25vh] right-0 left-0 mx-auto w-[1.5vw] h-[1.5vw] bg-red-500 rounded-full text-[1.7vh] text-[#FFF] flex justify-center items-center">
                {handleTotalNumber(notificationCounts.appointment)}
              </p>
            )}
          </button>
          <article className="w-[0.01vw] h-[80%] bg-[#003221]"></article>
          <button
            onClick={e => handleOptChange(e)}
            data-opt={3}
            type="button"
            className={`w-fit px-[0.5vw] relative h-full ${currentOpt === 3 && 'bg-[#FFF] border-b-[0.32vh] border-[#00A78B]'}`}
          >
            <p className="w-fit flex items-center flex-row gap-[0.5vw] text-[1.666667vh] font-normal text-[#00A78B]">
              Inventory
              <span>
                <InventoryNotiIcon />
              </span>
            </p>
            {notificationCounts.inventory > 0 && (
              <p className="absolute top-[-2.25vh] right-0 left-0 mx-auto w-[1.5vw] h-[1.5vw] bg-red-500 rounded-full text-[1.7vh] text-[#FFF] flex justify-center items-center">
                {handleTotalNumber(notificationCounts.inventory)}
              </p>
            )}
          </button>
          <article className="w-[0.01vw] h-[80%] bg-[#003221]"></article>
          <button
            onClick={e => handleOptChange(e)}
            data-opt={4}
            type="button"
            className={`w-fit px-[0.5vw] relative h-full ${currentOpt === 4 && 'bg-[#FFF] border-b-[0.32vh] border-[#00A78B]'}`}
          >
            <p className="w-fit flex items-center flex-row gap-[0.5vw] text-[1.666667vh] font-normal text-[#00A78B]">
              Customers
              <span>
                <CustomerNotiIcon />
              </span>
            </p>
            {notificationCounts.customers > 0 && (
              <p className="absolute top-[-2.25vh] right-0 left-0 mx-auto w-[1.5vw] h-[1.5vw] bg-red-500 rounded-full text-[1.7vh] text-[#FFF] flex justify-center items-center">
                {handleTotalNumber(notificationCounts.customers)}
              </p>
            )}
          </button>
          <article className="w-[0.01vw] h-[80%] bg-[#003221]"></article>
          <button
            onClick={e => handleOptChange(e)}
            data-opt={5}
            type="button"
            className={`w-fit px-[0.5vw] relative h-full ${currentOpt === 5 && 'bg-[#FFF] border-b-[0.32vh] border-[#00A78B]'}`}
          >
            <p className="w-fit flex items-center flex-row gap-[0.5vw] text-[1.666667vh] font-normal text-[#00A78B]">
              Warnings
              <span>
                <AdviceNotiIcon />
              </span>
            </p>
            {notificationCounts.warnings > 0 && (
              <p className="absolute top-[-2.25vh] right-0 left-0 mx-auto w-[1.5vw] h-[1.5vw] bg-red-500 rounded-full text-[1.7vh] text-[#FFF] flex justify-center items-center">
                {handleTotalNumber(notificationCounts.warnings)}
              </p>
            )}
          </button>
        </aside>
        {/* notifications row */}
        <aside 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="h-[42vh] relative overflow-y-scroll px-[0.5vw] flex flex-col gap-[1.8vh] mt-[1.5vh] max-lg:h-auto max-lg:flex-1 max-lg:mt-1"
        >
          {loadingContent ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
              <div className="w-8 h-8 border-4 border-[#00A78B] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : null}
          {notifications && notifications.length > 0 ? (
            <>
              {notifications.map(el =>
                el.type_id === 1 && currentOpt === 1 ? (
                  <General
                    key={el.id}
                    user={el.user?.name ? `${el.user?.name} ${el.user?.last_name || ''}` : userAltName}
                    message={dateFromNotifications(el.message) || ''}
                    sendDate={el.created_at || new Date()}
                    notiId={el.id}
                    isRead={el.is_read}
                    taskId={el.task_id}
                  />
                ) : el.type_id === 2 && currentOpt === 2 ? (
                  <Appointments
                    key={el.id}
                    customer={el.customers && `${el.customers?.first_name} ${el.customers?.last_name}`}
                    message={dateFromNotifications(el.message) || ''}
                    sendDate={el.created_at || new Date()}
                    user={el.user?.name ? `${el.user?.name} ${el.user?.last_name || ''}` : userAltName}
                    notiId={el.id}
                    isRead={el.is_read}
                    appointmentId={el.appointment_id}
                    taskId={el.task_id}
                  />
                ) : el.type_id === 3 && currentOpt === 3 ? (
                  <Inventory
                    key={el.id}
                    message={dateFromNotifications(el.message) || ''}
                    sendDate={el.created_at || new Date()}
                    user={el.user?.name ? `${el.user?.name} ${el.user?.last_name || ''}` : userAltName}
                    notiId={el.id}
                    isRead={el.is_read}
                    taskId={el.task_id}
                  />
                ) : el.type_id === 4 && currentOpt === 4 ? (
                  <Customers
                    key={el.id}
                    customer={`${el.customers?.first_name || el.unregistered_customer?.mobile_phone_number} ${
                      el.customers?.last_name || ''
                    }`}
                    img=""
                    message={dateFromNotifications(el.message) || ''}
                    sendDate={el.created_at || new Date()}
                    notiId={el.id}
                    isRead={el.is_read}
                    taskId={el.task_id}
                  />
                ) : el.type_id === 5 && currentOpt === 5 ? (
                  <Warning
                    key={el.id}
                    message={dateFromNotifications(el.message) || ''}
                    sendDate={el.created_at || new Date()}
                    user={el.user?.name ? `${el.user?.name} ${el.user?.last_name || ''}` : userAltName}
                    notiId={el.id}
                    isRead={el.is_read}
                    appointmentId={el.appointment_id}
                    taskId={el.task_id}
                  />
                ) : undefined,
              )}
              {loadingMore && (
                <div className="flex justify-center py-2">
                  <div className="w-6 h-6 border-2 border-[#00A78B] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </>
          ) : !loading && !loadingContent ? (
            <p className="text-[2vh] font-normal text-[#00A78B]">{`You don't have notifications`}</p>
          ) : null}
        </aside>
        {loading && (
          <Loader
            props={{
              style: {
                borderRadius: '0.520833vw',
              },
            }}
          />
        )}
      </div>
    </motion.section>
  );
}
