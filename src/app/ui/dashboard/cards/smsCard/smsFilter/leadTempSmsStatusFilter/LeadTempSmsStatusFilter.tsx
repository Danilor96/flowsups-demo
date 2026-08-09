import { FilterButton } from '&/dashboard/cards/smsCard/smsFilter/leadTempSmsStatusFilter/filterButton/FilterButton';
import { FilterOptions } from '&/dashboard/cards/smsCard/smsFilter/leadTempSmsStatusFilter/filterOptions/FilterOptions';
import useUiHandler from '@/hooks/closeComponentsHandler';

export function LeadTempSmsStatusFilter({
  inputDataOne,
  inputDataTwo,
  inputDataThree,
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
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  return (
    <article ref={ref} className="relative w-fit h-fit">
      <FilterButton onClick={toggleOpen} />
      {isOpen && (
        <FilterOptions
          inputDataTwo={inputDataTwo}
          inputDataOne={inputDataOne}
          inputDataThree={inputDataThree}
          onChange={onChange}
        />
      )}
    </article>
  );
}
