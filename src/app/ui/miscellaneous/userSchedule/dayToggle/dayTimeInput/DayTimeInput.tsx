import { TimeInput } from '&/miscellaneous/userSchedule/dayToggle/dayTimeInput/timeInput/TimeInput';

export function DayTimeInput({
  currentTime,
  index,
  from,
}: {
  currentTime: number;
  index: number;
  from: boolean;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <section className="w-fit h-fit flex flex-row">
      <TimeInput currentTime={currentTime} index={index} from={from} />
    </section>
  );
}
