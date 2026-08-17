import { adminDashboardStore } from '@/store/adminDashboard';
import { useEffect, useState } from 'react';
import { startOfDay } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { dateFormatsStore } from '@/store/dateFormats';
import { Button } from '&/buttons/Button';
import { SystemAccessHistory } from '&/icons/Icons';
import { AnimatePresence } from 'framer-motion';
import { SingleUserHistory } from './accessHistory/SingleUserHistory';
import { Can } from '@/app/ui/auth/Can';

const timeZone = 'America/New_York';

function getStartOfTodayUTCClient(): Date {
  const now = new Date();
  const zoned = toZonedTime(now, timeZone);
  return fromZonedTime(startOfDay(zoned), timeZone);
}

export function SystemAccesses() {
  // ----- global states -----

  const { dateFormatted } = dateFormatsStore();

  const { systemAccessesData, selectedUserSystemAccess } = adminDashboardStore();

  // ----- local states -----

  const [systemAccessTime, setSystemAccessTime] = useState({ entry: '', exit: '' });

  const [accessHistory, setAccessHistory] = useState(false);

  useEffect(() => {
    if (systemAccessesData && systemAccessesData.length > 0 && selectedUserSystemAccess) {
      const todayHistory = systemAccessesData.find(
        (el) =>
          new Date(el.entry_date) > getStartOfTodayUTCClient() &&
          el.user_id === selectedUserSystemAccess,
      );

      if (todayHistory) {
        setSystemAccessTime({
          entry: dateFormatted(1, todayHistory.entry_date),
          exit: dateFormatted(1, todayHistory.exit_date),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemAccessesData, selectedUserSystemAccess]);

  return (
    <div className="flex flex-row items-center gap-[1.2vw] max-lg:flex-col max-lg:items-start max-lg:gap-2">
      <aside className="flex flex-row gap-[0.3vw]">
        <p className="text-[2vh] text-primaryColor font-semibold">Today Entry:</p>
        <p className="text-[2vh] text-primaryColor">{systemAccessTime.entry || 'N/E'}</p>
      </aside>
      <aside className="flex flex-row gap-[0.3vw]">
        <p className="text-[2vh] text-primaryColor font-semibold">Today Exit:</p>
        <p className="text-[2vh] text-primaryColor">{systemAccessTime.exit}</p>
      </aside>
      <Can requiredPermission={43}>
        <aside>
          <Button
            backgroundColor="#FFF"
            identity=""
            textColor=""
            buttonIcon={<SystemAccessHistory />}
            marginInlineAuto
            border={0.05}
            borderColor="#00a78b"
            width={4}
            widthFitContent
            onClick={() => setAccessHistory(!accessHistory)}
          />
        </aside>
      </Can>
      <AnimatePresence>
        {accessHistory && <SingleUserHistory setAccessHistory={setAccessHistory} />}
      </AnimatePresence>
    </div>
  );
}
