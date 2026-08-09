import { CalculatorIcon } from '&/icons/Icons';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { Calculator } from './calculator/Calculator';

export function MonthlyIncomeCalculator({
  hourlyWage,
  yearToDate,
  index,
  onChange,
}: {
  hourlyWage: string;
  yearToDate: string;
  index: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  return (
    <aside ref={ref}>
      <button
        onClick={toggleOpen}
        type="button"
        className="w-[2vw] h-[2vw] flex justify-center items-center rounded-md shadow-crmFormShadow"
      >
        <CalculatorIcon />
      </button>
      {isOpen && (
        <Calculator
          hourlyWage={hourlyWage}
          yearToDate={yearToDate}
          index={index}
          onChange={onChange}
        />
      )}
    </aside>
  );
}
