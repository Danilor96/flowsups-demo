import { adminDashboardStore } from '@/store/adminDashboard';
import { useEffect } from 'react';
import { DateBefore, DayOfWeek, DayPicker, getDefaultClassNames } from 'react-day-picker';

export function DateHourPicker({
  dateSelected,
  onDateClick,
  onTimeChanged,
  top,
  right,
  zIndex,
  identity,
}: {
  dateSelected: Date | undefined;
  onDateClick: (event: Date) => void;
  onTimeChanged: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  top?: number;
  right?: number;
  zIndex?: number;
  identity?: string;
}) {
  // ----- global states -----

  const { dayTime } = adminDashboardStore();
  const { getDayTime } = adminDashboardStore();

  useEffect(() => {
    getDayTime();
  }, [getDayTime]);

  // ----- local states -----

  const dateBefore: DateBefore = {
    before: new Date(),
  };

  const dayOfWeew: DayOfWeek = {
    dayOfWeek: [-1, 7],
  };

  const defaultClassNames = getDefaultClassNames();

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute h-fit w-fit flex flex-row justify-center items-start gap-[0.5vw] bg-white rounded-[0.520833vw] shadow-crmFormShadow"
      style={{
        top: top ? `${top}vh` : '9.8vh',
        right: right ? `${right}vw` : '-5vw',
        zIndex: zIndex ? zIndex : 50,
      }}
    >
      <DayPicker
        mode="single"
        selected={dateSelected}
        onDayClick={onDateClick}
        disabled={[dateBefore, dayOfWeew]}
        className="text-[#00A78B] text-[2.1vh]"
        styles={{
          day_button: { width: '2.5vw', height: '6vh' },
          month_caption: { paddingInline: '1vw' },
          chevron: { fill: '#F00' },
        }}
      />
      <select
        name=""
        id=""
        onChange={onTimeChanged}
        className="w-[10vw] h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] mt-[2.5vh] mr-[1vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw] outline-none"
        data-identity={identity}
      >
        <option value="">Time</option>
        {dayTime &&
          dayTime.length > 0 &&
          dayTime.map((el) => (
            <option key={el.id} value={el.time}>
              {el.time}
            </option>
          ))}
      </select>
    </div>
  );
}
