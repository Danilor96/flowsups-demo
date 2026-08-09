import { IconedSelect } from '@/app/ui/select/iconedSelect/IconedSelect';
import { SearchInput } from '&/inputs/searchInput/SearchInput';
import { useState } from 'react';

export function ReportsFilter({
  onClick,
  onChange,
}: {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  // ----- global states -----

  // -----local states -----

  const [inputSearch, setInputSearch] = useState<string>();

  const inputsInfo = [
    {
      key: 1,
      height: 4.074074,
      width: 9.635417,
      defaultText: 'This',
      onClick: onClick,
      options: [{ value: '1', name: 'No sé' }],
      optionsBackgroundColor: '#FFF',
      optionsRadius: 0.48,
      optionsHeight: 5,
      optionsNameColor: '#00A78B',
      border: 0.104166,
      borderColor: '#00A78B',
      borderRadius: 1,
      textColor: '#00A78B',
      label: 'Date',
    },
    {
      key: 2,
      height: 4.074074,
      width: 9.635417,
      defaultText: 'Month',
      onClick: onClick,
      options: [{ value: '2', name: 'No sé' }],
      optionsBackgroundColor: '#FFF',
      optionsRadius: 0.48,
      optionsHeight: 5,
      optionsNameColor: '#00A78B',
      border: 0.104166,
      borderColor: '#00A78B',
      borderRadius: 1,
      textColor: '#00A78B',
    },
    {
      key: 3,
      height: 4.074074,
      width: 9.635417,
      defaultText: 'Last X Date',
      onClick: onClick,
      options: [{ value: '3', name: 'No sé' }],
      optionsBackgroundColor: '#FFF',
      optionsRadius: 0.48,
      optionsHeight: 5,
      optionsNameColor: '#00A78B',
      border: 0.104166,
      borderColor: '#00A78B',
      borderRadius: 1,
      textColor: '#00A78B',
      label: 'Created Date',
    },
    {
      key: 4,
      height: 4.074074,
      width: 9.635417,
      defaultText: 'Facebook',
      onClick: onClick,
      options: [{ value: '4', name: 'No sé' }],
      optionsBackgroundColor: '#FFF',
      optionsRadius: 0.48,
      optionsHeight: 5,
      optionsNameColor: '#00A78B',
      border: 0.104166,
      borderColor: '#00A78B',
      borderRadius: 1,
      textColor: '#00A78B',
      label: 'Customer Status',
    },
    {
      key: 5,
      height: 4.074074,
      width: 9.635417,
      defaultText: 'Internet',
      onClick: onClick,
      options: [{ value: '5', name: 'No sé' }],
      optionsBackgroundColor: '#FFF',
      optionsRadius: 0.48,
      optionsHeight: 5,
      optionsNameColor: '#00A78B',
      border: 0.104166,
      borderColor: '#00A78B',
      borderRadius: 1,
      textColor: '#00A78B',
      label: 'Lead Source',
    },
  ];

  return (
    <div className="w-fit h-fit flex flex-row justify-center items-end gap-[0.78125vw]">
      {inputsInfo.map((el) => (
        <IconedSelect
          key={el.key}
          height={el.height}
          width={el.width}
          iconTextGap={0}
          defaultText={el.defaultText}
          onClick={el.onClick}
          options={el.options}
          optionsBackgroundColor={el.optionsBackgroundColor}
          optionsWidth={el.width}
          optionsRadius={el.optionsRadius}
          optionsHeight={el.optionsHeight}
          optionsNameColor={el.optionsNameColor}
          border={el.border}
          borderColor={el.borderColor}
          borderRadius={el.borderRadius}
          textColor={el.textColor}
          label={el.label}
        />
      ))}
      <SearchInput
        onChange={onChange}
        width={9.635417}
        height={4.074074}
        placeholder="Search"
        label="Customer Name"
        value={inputSearch}
        name="search"
      />
    </div>
  );
}
