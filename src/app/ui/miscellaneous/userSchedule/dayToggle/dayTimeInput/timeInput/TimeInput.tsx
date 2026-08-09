import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { adminDashboardStore } from '@/store/adminDashboard';
import { TimeBtn } from '&/miscellaneous/userSchedule/dayToggle/dayTimeInput/timeInput/timeBtn/TimeBtn';

export function TimeInput({
  currentTime,
  index,
  from,
}: {
  currentTime: number;
  index: number;
  from: boolean;
}) {
  // ----- global states -----

  const { dayTime } = adminDashboardStore();

  // ----- local states -----

  return (
    <article className="w-fit flex flex-row items-center justify-center gap-[0.5vw] px-[0.5vw] py-[0.4vh] border-[0.025vw] border-[#D9D9D9] rounded-[0.3125vw]">
      <Paragraph color="#959595">
        {dayTime && dayTime.length > 0 && dayTime[currentTime]?.time}
      </Paragraph>
      <TimeBtn index={index} from={from} />
    </article>
  );
}
