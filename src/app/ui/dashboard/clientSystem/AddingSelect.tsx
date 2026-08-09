import { SelectDropIcon } from '&/icons/Icons';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { CheckboxInput } from '../../inputs/CheckboxInput';
import useUiHandler from '@/hooks/closeComponentsHandler';

export function AddingSelect({
  label,
  name,
  value,
  width,
  options,
  selectedValues = [],
  onChange,
  fieldErrors,
  // onSelect
  onMultiSelect
}: {
  name: string;
  label?: string;
  value: string;
  width: number;
  options: { value: number; option: string }[] | undefined;
  selectedValues?: (number | string)[];
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  fieldErrors?: { [key: string]: [string | undefined] };
  // onSelect?: (option: { value: number | string | undefined; option: string | undefined }) => void;
  onMultiSelect?: (selected: (number | string)[]) => void;
}) {
  const { isOpen, ref, toggleOpen, setIsOpen } = useUiHandler();

  const inputRef = useRef<HTMLInputElement>(null);

  const [filteredOptions, setFilteredOptions] = useState<{ value: number | undefined; option: string | undefined }[]>(
    options || []
  );

  // useEffect(() => {
  //   if (options && options.length > 0 && filteredOptions.length < 1) {
  //     setFilteredOptions(options);
  //   }
  // }, [options, filteredOptions]);
  useEffect(() => {
    if (value === '') {
      setFilteredOptions(options || []);
    }
  }, [value, options]);

  // handling filtered list
  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const searchTerm = value.toLowerCase();
    const searchTermArray = searchTerm.split(' ');

    if (!isOpen) {
      setIsOpen(true);
    }

    if (value !== '') {
      const filteredList = options?.filter(option => {
        const opt = option.option && option.option.toLowerCase();
        return searchTermArray.every(word => opt && opt.includes(word));
      });
      filteredList && setFilteredOptions(filteredList);
    } else {
      options && setFilteredOptions(options);
    }
  };

  const handleCheckboxChange = (optionValue: number | string | undefined) => {
    if (!optionValue) return;
    if (optionValue === 0) {
      onMultiSelect?.([]);
    }

    let newSelected: (number | string)[];
    if (selectedValues.includes(optionValue)) {
      newSelected = selectedValues.filter(val => val !== optionValue);
    } else {
      newSelected = [...selectedValues, optionValue];
    }
    onMultiSelect?.(newSelected);
    inputRef.current?.focus();
  };

  return (
    <div
      className="relative flex flex-col"
      style={{
        width: `${width}vw`
      }}
      ref={ref}
    >
      <label htmlFor={name} className="mb-[1.666667vh] text-[1.626852vh] font-medium text-[#00A78B]">
        {label}
      </label>
      <aside
        className="w-full flex flex-row items-center pl-2 rounded-l-[1.302083vw] border-[#00A78B] rounded-r-[1.302083vw] border-[0.13vw] overflow-hidden"
        onClick={() => toggleOpen()}
      >
        {selectedValues.length > 0 && (
          <div className="text-[0.75rem] w-fit bg-gray-200 rounded-2xl flex justify-center items-center gap-1 p-1">
            <span className="text-gray-600">{`(+${selectedValues.length})`}</span>
            <button onClick={() => onMultiSelect?.([])} title="Remove all selected">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M18 6l-12 12" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <input
          ref={inputRef}
          onChange={e => {
            handleFilter(e);
            // setShowOptions(true);
            onChange(e);
          }}
          type="text"
          name={name}
          id={name}
          value={value}
          autoComplete="off"
          placeholder="Search..."
          className="w-[85%] h-[5.277778vh] outline-none pl-[0.2vw] pr-[0.2vw] text-[1.666667vh] font-medium text-[#00A78B]"
        />
        <button
          onClick={() => toggleOpen()}
          className="w-[20%] h-[5.277778vh] pr-[0.6rem] flex justify-end items-center "
        >
          <SelectDropIcon color="#00A78B" />
        </button>
      </aside>
      {isOpen && (
        <aside className="absolute top-[100%] mt-1 min-w-52 border-x border-y border-gray-400 rounded-md z-50 w-full max-h-[23.8vh] bg-[#F4F4F4] text-[1.666667vh] font-medium text-[#959595] shadow-crmFormShadow overflow-y-scroll">
          {filteredOptions.length === 0 && <p className="p-2 mx-auto text-center">No results found</p>}
          {filteredOptions.map(el => (
            <button
              key={el.value}
              className="text-start w-full min-h-[4.8vh] h-auto py-1 flex justify-start items-center hover:bg-[#C9EBE6] transition-colors ease-in-out px-[0.6vw]"
              onClick={e => {
                e.preventDefault();
                // onSelect?.(el);
                // setShowOptions(false);
                handleCheckboxChange(el.value);
              }}
            >
              <CheckboxInput
                name={`${el.value}-checkbox`}
                key={`${el.value}-checkbox`}
                chekcboxText=""
                checked={selectedValues.includes(el.value as number | string)}
                onChange={() => handleCheckboxChange(el.value)}
                onClick={e => e.stopPropagation()}
              />
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
