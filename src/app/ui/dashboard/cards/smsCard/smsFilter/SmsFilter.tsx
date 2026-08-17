import { LeadTempSmsStatusFilter } from '&/dashboard/cards/smsCard/smsFilter/leadTempSmsStatusFilter/LeadTempSmsStatusFilter';
import { Input } from '&/inputs/Input';
import { DatePickerFilter } from '&/dashboard/appointmentSystem/appointmentCalendar/datePickerFilter/DatePickerFilter';
import { DateRange } from 'react-day-picker';
import { Button } from '&/buttons/Button';
import { DropMenu } from '&/icons/Icons';
import useUiHandler from '@/hooks/closeComponentsHandler';

export function SmsFilter({
  inputDataOne,
  inputDataTwo,
  inputDataThree,
  customer,
  assigned,
  selectedFromRange,
  selectedToDate,
  buttonText,
  handleClearOrSetTodayDateFilter,
  handleDateRange,
  onChange,
}: {
  inputDataOne: {
    id: number;
    label: string;
    name: string;
    type: string;
    width: number;
    value: string;
    chekcboxText: string;
    temp?: number;
    leadIcon?: boolean;
  }[];
  inputDataTwo: {
    id: number;
    label: string;
    name: string;
    type: string;
    width: number;
    value: string;
    chekcboxText: string;
  }[];
  inputDataThree: {
    id: number;
    label: string;
    name: string;
    type: string;
    width: number;
    value: string;
    chekcboxText: string;
  }[];
  customer: string;
  assigned: string;
  selectedFromRange: Date | undefined;
  selectedToDate: Date | undefined;
  buttonText: string;
  handleClearOrSetTodayDateFilter: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleDateRange: (e: DateRange | undefined) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  return (
    <div className="w-full h-fit flex flex-row justify-end items-center gap-[1.5vw] pr-[1vw] max-lg:flex-col max-lg:items-stretch max-lg:gap-2 max-lg:pr-0">
      <LeadTempSmsStatusFilter
        inputDataOne={inputDataOne}
        inputDataTwo={inputDataTwo}
        inputDataThree={inputDataThree}
        onChange={onChange}
      />
      <Input
        label=""
        name="customer"
        type="text"
        width={11}
        value={customer}
        onChange={onChange}
        backgroundColor="#FFF0"
        border={0.058}
        textAlterColor="#FFF"
        borderColor="#FFF"
        borderRadius={1.3}
        searchLensIcon
        placeholder="Customer Search"
        capitalString
      />
      <Input
        label=""
        name="assigned"
        type="text"
        width={11}
        value={assigned}
        onChange={onChange}
        backgroundColor="#FFF0"
        border={0.058}
        textAlterColor="#FFF"
        borderColor="#FFF"
        borderRadius={1.3}
        searchLensIcon
        placeholder="Assigned Search"
        capitalString
      />
      <aside ref={ref} className="relative">
        <Button
          backgroundColor="#FFF0"
          border={0.058}
          borderColor="#FFF"
          borderRadius={1.3}
          identity="dateFilter"
          textColor="#FFF"
          width={11}
          iconRight
          buttonText={buttonText}
          buttonIcon={<DropMenu />}
          iconTextSpaceBetween
          onClick={toggleOpen}
        />
        {isOpen && (
          <DatePickerFilter
            handleClearOrSetTodayDateFilter={handleClearOrSetTodayDateFilter}
            handleDateRange={handleDateRange}
            selectedFromRange={selectedFromRange}
            selectedToDate={selectedToDate}
          />
        )}
      </aside>
    </div>
  );
}
