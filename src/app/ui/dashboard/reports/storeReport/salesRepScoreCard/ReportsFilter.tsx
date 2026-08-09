import { Input } from '@/app/ui/inputs/Input';
import React from 'react';

interface ReportsFilterProps {
  onChange: (date: Date) => void;
  selectedDate: string | null;
  selectedDateInput: string | null;
}

export function ReportsFilter({ onChange, selectedDate, selectedDateInput }: ReportsFilterProps) {
  return (
    <div className="flex items-center">
      <Input
        type="DottedDate"
        name="date"
        label="Date"
        value={selectedDateInput || ''}
        onChange={() => {}}
        width={10}
        inputWidth={80}
        selectBtnWidth={20}
        identity="date"
        backgroundColor="#FFF"
        border={0.104166}
        borderColor="#00A78B"
        borderRadius={1.302083}
        textAlterColor="#00A78B"
        labelSameColor={true}
        dayPickerDisabledAfter={new Date()}
        disabled
        noDisabledBgColor={true}
        onDayPickerClick={(date) => onChange(date)}
      />
    </div>
  );
}
