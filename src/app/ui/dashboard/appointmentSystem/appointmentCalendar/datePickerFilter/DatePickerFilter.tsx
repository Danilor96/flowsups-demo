import { Button } from '&/buttons/Button';
import { DayPicker, DateRange, getDefaultClassNames } from 'react-day-picker';

export function DatePickerFilter({
  selectedFromRange,
  selectedToDate,
  handleDateRange,
  handleClearOrSetTodayDateFilter,
}: {
  selectedFromRange: Date | undefined;
  selectedToDate: Date | undefined;
  handleDateRange: (e: DateRange | undefined) => void;
  handleClearOrSetTodayDateFilter: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <aside
      onClick={(e) => e.stopPropagation()}
      className="absolute top-[6vh] left-[-5.5vw] z-40 w-fit h-fit flex flex-row px-[0.5vw] py-[0.9vh] bg-[#FFFFFF] border border-[#00A78B] rounded-[0.94vw]"
    >
      <DayPicker
        mode="range"
        onSelect={handleDateRange}
        selected={{
          from: selectedFromRange,
          to: selectedToDate,
        }}
        disabled={{
          dayOfWeek: [0, 6],
        }}
        style={{
          color: '#00A78B',
          fill: '#FFF',
        }}
        styles={{
          day_button: { width: '2.5vw', height: '6vh' },
          month_caption: { paddingInline: '1vw' },
        }}
      />
      <div className="w-fit h-fit flex flex-col gap-[0.5vh] mt-[5vh] rounde">
        <Button
          onClick={handleClearOrSetTodayDateFilter}
          width={4}
          height={4}
          identity="clearDateFilter"
          backgroundColor="#FFF"
          border={0.02}
          borderColor="#00A78B"
          textColor="#00A78B"
          buttonText="Clear"
          borderRadius={1.5}
        />
        <Button
          onClick={handleClearOrSetTodayDateFilter}
          width={4}
          height={4}
          identity="today"
          backgroundColor="#FFF"
          border={0.02}
          borderColor="#00A78B"
          textColor="#00A78B"
          buttonText="Today"
          borderRadius={1.5}
        />
      </div>
    </aside>
  );
}
