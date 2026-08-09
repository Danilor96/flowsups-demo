import { DayToggle } from '&/miscellaneous/userSchedule/dayToggle/DayToggle';
import { adminDashboardStore } from '@/store/adminDashboard';
import { daytimeStore } from '@/store/userSchedule';
import { useEffect } from 'react';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';

export function UserSchedule() {
  // ----- global states -----

  const { dayweeks } = adminDashboardStore();
  const { getDayweeks } = adminDashboardStore();

  const { daytimeFrom, daytimeTo } = daytimeStore();

  useEffect(() => {
    getDayweeks();
  }, [getDayweeks]);

  // ----- local states -----

  return (
    <div className="flex flex-col gap-[1.5vh]">
      <Paragraph>Hours</Paragraph>
      <aside className="w-[25vw] h-[37vh] flex flex-col justify-center items-center gap-[1vh] bg-[#F4F4F4] px-[1.25vw] py-[1.944444vh] rounded-[0.520833vw]">
        {dayweeks &&
          dayweeks.length > 0 &&
          dayweeks.map((el, index) => (
            <DayToggle
              key={el.id}
              day={el.day}
              index={index}
              currentTimeFrom={daytimeFrom[index]}
              currentTimeTo={daytimeTo[index]}
            />
          ))}
      </aside>
    </div>
  );
}
