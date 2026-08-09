import useUiHandler from '@/hooks/closeComponentsHandler';
import { dateFormatsStore } from '@/store/dateFormats';
import { useCalendarStore } from '@/store/monthNavigation';
import { getWeeksInMonth, startOfWeek, endOfWeek, addWeeks } from 'date-fns';
import { Loader } from '../../loader/Loader';

export function WeekPicker() {
  // global states

  const { currentMonth, currentYear, currentWeek, fetchingData, setWeek } = useCalendarStore();

  const { dateFormatted } = dateFormatsStore();

  // local states

  const currentDateSelected = new Date(currentYear, currentMonth);

  const iterableCount = getWeeksInMonth(currentDateSelected, {
    weekStartsOn: 1,
  });

  const weekOpts = Array.from({ length: iterableCount }, (_, i) => i + 1);

  const { isOpen, ref, toggleOpen } = useUiHandler();

  const weekStarted = startOfWeek(currentDateSelected, {
    weekStartsOn: 1,
  });

  const weekEnded = endOfWeek(currentDateSelected, {
    weekStartsOn: 1,
  });

  const returnWeekSpan = (week: number) => {
    const fromToWeekOptSelected = `${dateFormatted(
      7,
      addWeeks(weekStarted, week - 1),
    )} - ${dateFormatted(7, addWeeks(weekEnded, week - 1))}`;

    return fromToWeekOptSelected;
  };

  return (
    <div ref={ref} className="relative w-fit">
      <label className="text-primaryColor text-[2.2vh]">Week</label>
      <aside
        onClick={fetchingData ? undefined : toggleOpen}
        className="h-[5vh] flex justify-center items-center text-primaryColor text-[2vh] rounded-[1vw] border border-primaryColor px-[0.4vw] cursor-pointer"
        style={{
          position: fetchingData ? 'relative' : 'static',
          width: fetchingData ? '9vw' : 'fit-content',
          overflow: fetchingData ? 'hidden' : undefined,
        }}
      >
        {fetchingData ? <Loader /> : returnWeekSpan(currentWeek)}
      </aside>
      {isOpen && (
        <ul className="absolute top-[105%] z-[5] w-fit h-fit flex flex-col justify-start items-start text-primaryColor rounded-[1vw] border border-primaryColor text-[2vh] overflow-hidden text-nowrap bg-white shadow-crmFormShadow">
          {weekOpts.map((el, index) => (
            <li key={`weeksOpts,,${index}`} className="w-full">
              <button
                className={`w-full px-[0.5vw] py-[0.7vh] transition-colors text-left ${
                  currentWeek === el
                    ? 'bg-primaryColor text-white'
                    : 'hover:bg-primaryColor hover:text-white'
                }`}
                onClick={() => {
                  if (currentWeek !== el) {
                    setWeek(el);

                    toggleOpen();
                  }
                }}
              >
                {returnWeekSpan(el)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
