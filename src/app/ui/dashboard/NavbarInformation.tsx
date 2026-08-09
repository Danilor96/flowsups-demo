'use client';

import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { NavbarItem } from './NavarInformation/NavbarItem';

export function NavbarInformation({ roleId }: { roleId: number }) {
  // ----- global states -----
  const { data: session } = useSession();

  const userId = session?.user.id;

  const { openInNewTab } = modalWindowStore();

  const {
    openDailyAppointments,
    openDailyCalls,
    openMissingTasks,
    openDailyMessages,
    openDailyMadeCreditApp,
    openDailySells,
  } = modalWindowStore();

  const { dailyTotals } = adminDashboardStore();
  const { getTodayTotals } = adminDashboardStore();

  useEffect(() => {
    if (userId) {
      getTodayTotals(userId);
    }
  }, [userId, getTodayTotals]);

  const data = [
    { id: 1, title: 'Daily Calls', count: dailyTotals.dailyCallsCount, event: 1 },
    {
      id: 2,
      title: 'Daily Messages',
      count: dailyTotals.dailyMessagesCount,
      event: 2,
    },
    {
      id: 3,
      title: 'Daily Made Appointments',
      count: dailyTotals.dailyMadeAppointmentCount,
      event: 3,
    },
    { id: 4, title: 'Missing Tasks', count: dailyTotals.missingTasksCount, event: 4 },
    {
      id: 5,
      title: 'Daily Made Credit App',
      count: dailyTotals.dailyMadeCreditAppCount,
      event: 5,
    },
    { id: 6, title: 'Daily sells', count: dailyTotals.dailySellsCount, event: 6 },
  ];

  // local states

  const handleOpenModals = (e: string) => {
    switch (e) {
      case '1':
        openDailyCalls();
        break;
      case '2':
        openDailyMessages();
        break;
      case '3':
        openDailyAppointments();
        break;
      case '4':
        openMissingTasks();
        break;
      case '5':
        openDailyMadeCreditApp();
        break;
      case '6':
        openDailySells();
        break;
    }
  };

  return (
    <>
      {data.map((el) => (
        <NavbarItem
          key={el.id}
          title={el.title}
          count={el.count || 0}
          event={el.event}
          onOpen={handleOpenModals}
          openInNewTab={openInNewTab}
        />
      ))}
    </>
  );
}
