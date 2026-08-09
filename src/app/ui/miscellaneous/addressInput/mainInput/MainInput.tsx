import { ThreeGreenDots } from '@/app/ui/icons/Icons';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { AnimatePresence } from 'framer-motion';
import { AddressOptions } from '../addressOptions/AddressOptions';

export function MainInput({
  value,
  name,
  id,
  addressOptions,
  manualStates,
  disabled,
  onChange,
}: {
  name: string;
  value: string;
  id: string;
  disabled?: boolean;
  addressOptions: {
    street: string;
    streetName: string;
    city: string;
    cityName: string;
    state: string;
    stateName: string;
    zip: string;
    zipName: string;
    county: string;
    countyName: string;
    handleChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      index?: number,
    ) => void;
  };
  manualStates?:
    | {
        id: number;
        state: string;
      }[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>, index?: number) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  return (
    <div ref={ref}>
      <aside className="flex flex-row">
        <input
          value={value}
          onChange={onChange}
          name={name}
          id={id}
          type="text"
          autoComplete="off"
          disabled={disabled}
          className="w-[90%] h-[5.277778vh] px-[1vw] rounded-l-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] outline-none"
          style={{
            backgroundColor: !disabled ? '#F4F4F4' : '#C9EBE6',
          }}
        />
        <button
          onClick={toggleOpen}
          className="w-[10%] h-[5.277778vh] bg-[#C9EBE6] flex justify-center items-center rounded-r-[0.520833vw]"
          style={{
            cursor: disabled ? 'default' : '',
          }}
        >
          <ThreeGreenDots />
        </button>
      </aside>
      <AnimatePresence>
        {isOpen && !disabled && (
          <AddressOptions addressOptions={addressOptions} manualStates={manualStates} />
        )}
      </AnimatePresence>
    </div>
  );
}
