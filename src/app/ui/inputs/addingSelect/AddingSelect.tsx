import { SelectDropIcon } from '&/icons/Icons';
import { handlingCapitalWords } from '@/app/libs/functions/inputs/inputsFunction';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function AddingSelect({
  label,
  name,
  value,
  width,
  options,
  onChange,
  fieldErrors,
  disabled,
  onSelect,
  capitalString,
}: {
  name: string;
  label?: string;
  value: string;
  width: number;
  disabled?: boolean;
  options: { value: number | undefined; option: string | undefined }[] | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  fieldErrors?: { [key: string]: [string | undefined] };
  onSelect?: (option: { value: number | string | undefined; option: string | undefined }) => void;
  capitalString?: boolean;
}) {
  const [filteredOptions, setFilteredOptions] = useState<
    { value: number | undefined; option: string | undefined }[]
  >([]);

  useEffect(() => {
    if (options && options.length > 0 && filteredOptions.length < 1) {
      setFilteredOptions(options);
    }
  }, [options, filteredOptions]);

  // handling filtered list
  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const searchTerm = value.toLowerCase();
    const searchTermArray = searchTerm.split(' ');

    if (value !== '') {
      const filteredList = options?.filter((option) => {
        const opt = option.option && option.option.toLowerCase();
        return searchTermArray.every((word) => opt && opt.includes(word));
      });
      filteredList && setFilteredOptions(filteredList);
    } else {
      options && setFilteredOptions(options);
    }
  };

  const { isOpen, ref, toggleOpen } = useUiHandler();

  return (
    <div
      ref={ref}
      className="relative flex flex-col"
      style={{
        width: `${width}vw`,
      }}
    >
      <label
        htmlFor={name}
        className="mb-[1.666667vh] text-[1.626852vh] font-medium text-[#B3B3B3]"
      >
        {label}
      </label>
      <aside className="flex flex-row">
        <input
          onChange={(e) => {
            handleFilter(e);
            if (!isOpen && e.currentTarget.value !== '') {
              toggleOpen();
            }
            onChange(e);
          }}
          type="text"
          name={name}
          id={name}
          disabled={disabled}
          value={capitalString ? handlingCapitalWords(value) : value}
          autoComplete="off"
          className="w-[85%] h-[5.277778vh] rounded-l-[0.520833vw] bg-[#F4F4F4] outline-none px-[0.6vw] text-[1.666667vh] font-medium text-[#959595]"
        />
        <button
          onClick={toggleOpen}
          disabled={disabled}
          className="w-[15%] h-[5.277778vh] pr-[0.3vw] flex justify-end items-center rounded-r-[0.520833vw] bg-[#F4F4F4]"
        >
          <SelectDropIcon />
        </button>
      </aside>
      {isOpen && (
        <aside className="absolute top-[9.6vh] z-50 w-full max-h-[15.8vh] bg-[#F4F4F4] text-[1.666667vh] font-medium text-[#959595] shadow-crmFormShadow overflow-y-scroll">
          {filteredOptions.map((el) => (
            <button
              key={el.value}
              className="w-full h-[4.8vh] flex justify-start items-center hover:bg-[#C9EBE6] transition-colors ease-in-out px-[0.6vw]"
              onClick={() => {
                onSelect?.(el);
                toggleOpen();
              }}
            >
              {el.option}
            </button>
          ))}
        </aside>
      )}
      <AnimatePresence>
        {fieldErrors && name && fieldErrors[name] && fieldErrors[name].length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute bottom-[-2.1vh] text-[1.666667vh] text-[#F00]"
          >
            {fieldErrors[name][0]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
