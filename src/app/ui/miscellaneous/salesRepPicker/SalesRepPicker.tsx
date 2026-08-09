import useUiHandler from '@/hooks/closeComponentsHandler';
import { ThreeGreenDots } from '&/icons/Icons';
import { adminDashboardStore } from '@/store/adminDashboard';
import { useEffect, useState } from 'react';
import { SalesRepsList } from './salesRepsList/SalesRepsList';
import { Sellers } from '@/app/libs/definitions';

export function SalesRepPicker({
  width,
  name,
  value,
  identity,
  disabled,
  noDisabledBgColor,
  onChange,
  onClick,
}: {
  width: number;
  name: string;
  value: string;
  identity: string;
  disabled?: boolean;
  noDisabledBgColor?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // ----- global states -----

  const { sellersData } = adminDashboardStore();
  const { getSellers } = adminDashboardStore();

  useEffect(() => {
    getSellers();
  }, [getSellers]);

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  const [filteredList, setFilteredList] = useState<Sellers>(undefined);

  useEffect(() => {
    if (sellersData && sellersData.length > 0) {
      const sellers = [...sellersData];

      if (value && value.length > 0) {
        const searchParamArray = value.toLowerCase().split(' ');

        // const filteredData = sellers.filter((rep) => {
        //   const name = rep?.name ? rep.name.toLowerCase() : null;
        //   const lastname = rep?.last_name ? rep.last_name.toLowerCase() : null;

        //   return searchParamArray.every((word) => name?.includes(word) || lastname?.includes(word));
        // });

        // setFilteredList(filteredData);
        setFilteredList(sellers);
      } else {
        setFilteredList(sellers);
      }
    } else {
      setFilteredList(undefined);
    }
  }, [value, sellersData]);

  return (
    <div
      className="relative flex flex-col"
      style={{
        width: `${width}vw`,
      }}
    >
      <label
        htmlFor={name}
        className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
      >
        Sales Rep
      </label>
      <aside ref={ref} className="flex flex-row">
        <input
          type="text"
          name={name}
          id={name}
          value={value}
          disabled={disabled}
          onChange={(e) => {
            onChange(e);

            if (value.length > 0 && !isOpen) {
              toggleOpen();
            }
          }}
          className={`w-[90%] h-[5.277778vh] rounded-l-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw] outline-none ${
            disabled && !noDisabledBgColor ? 'bg-[#C9EBE6]' : 'bg-[#F4F4F4]'
          }`}
        />
        <button
          onClick={toggleOpen}
          type="button"
          className="w-[10%] h-[5.277778vh] bg-[#C9EBE6] flex justify-center items-center rounded-r-[0.520833vw]"
        >
          <ThreeGreenDots />
        </button>
        {isOpen && !disabled && (
          <SalesRepsList
            identity={identity}
            filteredList={filteredList}
            onClick={onClick}
            toggleOpen={toggleOpen}
          />
        )}
      </aside>
    </div>
  );
}
