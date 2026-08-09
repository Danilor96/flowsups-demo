import { SelectDropIcon } from '&/icons/Icons';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CheckboxInput } from '@/app/ui/inputs/CheckboxInput';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { el } from 'date-fns/locale';

interface option {
  id: number;
  phoneType: string;
  phoneNumber: string;
}

export function PhoneSelector({
  name,
  value,
  width,
  options = [],
  onChange,
  className
}: {
  name: string;
  label?: string;
  value: option | undefined | null;
  width: number;
  options: option[];
  onChange: (phone: option) => void;
  fieldErrors?: { [key: string]: [string | undefined] };
  className?: string;
}) {
  const formatNumber = phoneNumbersFormatStore(state => state.formatPhoneNumber);

  const { isOpen, ref, toggleOpen } = useUiHandler();

  const optionSelected = value ;

  return (
    <div
      className={`${className} relative flex flex-col`}
      style={{
        width: `${width}vw`
      }}
      ref={ref}
    >
      <aside
        className="w-full flex flex-row items-center  rounded-l-[0.5vw] rounded-r-[0.5vw] border-[#00A78B]  border-2 overflow-hidden"
        onClick={() => toggleOpen()}
      >
        <div className="w-[85%] h-[5.277778vh] pl-[0.2vw] pr-[0.2vw] overflow-clip">
          <div
            className="text-start w-full h-[4.8vh] flex justify-start items-center hover:bg-[#C9EBE6]/ transition-colors ease-in-out
               px-[0.6vw] py-2"
          >
            <div className="flex gap-2 ">
              <span className="font-semibold text-[#00A78B]">
                {optionSelected?.phoneType ? optionSelected.phoneType?.toUpperCase() : ''}
              </span>
              <span className="text-nowrap text-gray-600  overflow-ellipsis">
                {optionSelected?.phoneNumber ? formatNumber(optionSelected?.phoneNumber) : ''}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => toggleOpen()}
          className="w-[20%] h-[5.277778vh] pr-[0.6rem] flex justify-end items-center "
        >
          <SelectDropIcon color="#00A78B" />
        </button>
      </aside>
        <aside
          ref={ref}
          className={`min-w-[100%] max-w-max py-2 flex flex-col gap-2 border-x border-y border-gray-400 absolute rounded-md z-50 w-full 
          max-h-[23.8vh] bg-[#F4F4F4] text-[1.666667vh] font-medium text-[#959595] shadow-crmFormShadow overflow-y-scroll top-[5.999vh] 
          ${isOpen ? 'block' : 'hidden'}`}
          style={{
            ...(isOpen &&
              typeof window !== "undefined" &&
              window.innerHeight - (ref.current?.getBoundingClientRect().bottom ?? 0) < 200
              ? { bottom: '5.999vh', top: 'auto' }
              : { top: '5.999vh', bottom: 'auto' }
            )
          }}
        >
          {options.map(el => (
            <button
              key={el.id}
              className={`text-start w-full h-[5.5vh] flex justify-start items-center hover:bg-[#C9EBE6] transition-colors ease-in-out
               px-[0.6vw] py-[0.6vh] ${optionSelected?.id === el.id ? 'bg-[#C9EBE6]' : ''}`}
              onClick={e => {
                e.preventDefault();
                onChange(el);
                toggleOpen();
              }}
            >
              <div className="flex flex-col py-2">
                <span className="font-semibold">{el.phoneType.toUpperCase()}</span>
                <span className="">{el.phoneNumber && formatNumber(el.phoneNumber)}</span>
              </div>
            </button>
          ))}
        </aside>
    </div>
  );
}
