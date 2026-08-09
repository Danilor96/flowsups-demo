import { ThreeGreenDots } from '@/app/ui/icons/Icons';
import { DateHourPicker } from '@/app/ui/miscellaneous/dateHourPicker/DateHourPicker';
import useUiHandler from '@/hooks/closeComponentsHandler';

export function FollowUpDate({
  date,
  value,
  onDateClick,
  onTimeChange,
}: {
  date?: Date;
  value?: Date;
  onDateClick: (event: Date) => void;
  onTimeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  return (
    <div ref={ref} className="relative flex flex-col w-[16.458333vw]">
      <label
        htmlFor="leadFollowUpDate"
        className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
      >
        Follow Up Date
      </label>
      <aside className="flex flex-row">
        <input
          type="text"
          name="leadFollowUpDate"
          id="leadFollowUpDate"
          value={date ? new Date(date).toLocaleString() : ''}
          disabled
          autoComplete="off"
          className="w-[90%] h-[5.277778vh] bg-[#F4F4F4] rounded-l-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
        />
        <button
          onClick={toggleOpen}
          type="button"
          className="w-[10%] h-[5.277778vh] bg-[#C9EBE6] flex justify-center items-center rounded-r-[0.520833vw]"
        >
          <ThreeGreenDots />
        </button>
      </aside>
      {isOpen && (
        <DateHourPicker
          onDateClick={onDateClick}
          onTimeChanged={onTimeChange}
          dateSelected={value}
        />
      )}
    </div>
  );
}
