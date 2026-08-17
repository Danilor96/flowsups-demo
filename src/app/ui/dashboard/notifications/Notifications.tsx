'use client';

import { adminDashboardStore } from '@/store/adminDashboard';
import { AnimatePresence, motion } from 'framer-motion';
import { NotificationRing } from '&/icons/Icons';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { MainContent } from '&/dashboard/notifications/mainContent/MainContent';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function Notifications() {
  // ----- globa states -----
  const { data: session } = useSession();

  const userId = session?.user.id;

  const roleId = session?.user.user_has[0].role_id;

  const { totalNotifications } = adminDashboardStore();
  const { getTotalNotifications } = adminDashboardStore();

  useEffect(() => {
    if (userId && roleId) {
      getTotalNotifications(userId, roleId);
    }
  }, [getTotalNotifications, userId, roleId]);

  // ----- local states -----

  const { ref, isOpen, toggleOpen } = useUiHandler();

  const handleTotalNumber = (total: number | undefined) => {
    let totalNotifications = total ? total.toString() : '';

    if (totalNotifications && parseInt(totalNotifications) > 10) {
      totalNotifications = '+10';
    }

    return totalNotifications;
  };

  return (
    <div ref={ref} className="relative">
      <motion.button
        onClick={toggleOpen}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`relative w-[2.864583vw] h-[2.864583vw] flex items-center justify-center rounded-full shadow-crmFormShadow max-lg:w-9 max-lg:h-9 ${
          totalNotifications && 'border-[0.1vw] border-red-500'
        }`}
      >
        {totalNotifications && (
          <p className="absolute bottom-[-1.8vh] right-0 w-[1.5vw] h-[1.5vw] flex justify-center items-center text-[1.8vh] font-medium text-[#FFF] rounded-full bg-red-500 max-lg:w-5 max-lg:h-5 max-lg:text-xs">
            {handleTotalNumber(totalNotifications)}
          </p>
        )}
        <NotificationRing />
      </motion.button>
      <AnimatePresence>{isOpen && <MainContent />}</AnimatePresence>
    </div>
  );
}
