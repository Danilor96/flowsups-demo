import { SelectDropIcon } from '&/icons/Icons';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CheckboxInput } from '@/app/ui/inputs/CheckboxInput';
import useUiHandler from '@/hooks/closeComponentsHandler';

interface option {
  id: number;
  name: string;
  email: string;
}

export function AddingSelect({
  name,
  value,
  width,
  options,
  selectedValues = [],
  onChange,
  onMultiSelect
}: {
  name: string;
  label?: string;
  value: string;
  width: number;
  options: option[] | undefined;
  selectedValues?: option[];
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  fieldErrors?: { [key: string]: [string | undefined] };
  // onSelect?: (option: { value: number | string | undefined; option: string | undefined }) => void;
  onMultiSelect?: (selected: option[]) => void;
}) {
  const { isOpen, ref, toggleOpen } = useUiHandler();

  const [filteredOptions, setFilteredOptions] = useState<{ id: number; name: string; email: string }[]>(options || []);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    if (options && options.length > 0 && filteredOptions.length < 1 && value === '') {
      setFilteredOptions(options);
    }
  }, [options]);

  // handling filtered list
  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const searchTerm = value.toLowerCase();
    const searchTermArray = searchTerm.split(' ');

    if (value !== '') {
      const filteredList = options?.filter(option => {
        const opt = option.name && option.name.toLowerCase();
        return searchTermArray.every(word => opt && opt.includes(word));
      });
      filteredList && setFilteredOptions(filteredList);
    } else {
      options && setFilteredOptions(options);
    }
  };

  const handleCheckboxChange = (optionSelected: option) => {
    if (!optionSelected) return;
    if (optionSelected.id === 0) {
      onMultiSelect?.([]);
    }
    const optionExists = selectedValues.find(opt => opt.id === optionSelected.id);
    let newSelected: option[];
    if (optionExists) {
      newSelected = selectedValues.filter(opt => opt.id !== optionSelected.id);
    } else {
      newSelected = [...selectedValues, optionSelected];
    }
    onMultiSelect?.(newSelected);
  };

  return (
    <div
      className="relative flex flex-col !max-lg:w-full"
      style={{
        width: `${width}vw`
      }}
      ref={ref}
    >
      <aside
        className="w-full flex flex-row items-center pl-2 rounded-l-[0.5vw] rounded-r-[0.5vw] border-[#00A78B]  border-2 overflow-hidden"
        onClick={() => toggleOpen()}
      >
        {selectedValues.length > 0 && (
          <div className="text-[0.75rem] max-w-max bg-gray-200 rounded-2xl flex justify-center items-center gap-1 p-1">
            <span className="text-gray-600 flex-nowrap text-nowrap">{`${selectedValues[0].name} ${
              selectedValues.length > 1 ? `(+${selectedValues.length - 1})` : ''
            }`}</span>
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
        <div className="w-[85%] h-[5.277778vh] pl-[0.2vw] pr-[0.2vw] max-lg:h-11">
          <input
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
            className="outline-none text-[1.666667vh] font-medium text-[#00A78B] w-full h-full max-lg:text-sm"
          />
        </div>
        <button
          onClick={() => toggleOpen()}
          className="w-[20%] h-[5.277778vh] pr-[0.6rem] flex justify-end items-center max-lg:h-11"
        >
          <SelectDropIcon color="#00A78B" />
        </button>
      </aside>
      {isOpen && (
        <aside
          className="min-w-[100%] max-w-max py-2 flex flex-col gap-2 border-x border-y border-gray-400 absolute rounded-md z-50 w-full 
          max-h-[23.8vh] bg-[#F4F4F4] text-[1.666667vh] font-medium text-[#959595] shadow-crmFormShadow overflow-y-scroll  top-[5.999vh] max-lg:max-h-48 max-lg:text-sm"
        >
          {filteredOptions.length === 0 && <p className="p-2 mx-auto text-center">No results found</p>}
          {filteredOptions.map(el => (
            <button
              key={el.id}
              className="text-start w-full h-[4.8vh] flex justify-start items-center hover:bg-[#C9EBE6] transition-colors ease-in-out
               px-[0.6vw] py-2"
              onClick={e => {
                e.preventDefault();
                handleCheckboxChange(el);
              }}
            >
              <CheckboxInput
                name={`${el.id}-checkbox`}
                key={`${el.id}-checkbox`}
                chekcboxText=""
                checked={selectedValues.find(opt => opt.id === el.id) !== undefined}
                onChange={() => handleCheckboxChange(el)}
                onClick={e => e.stopPropagation()}
              />
              <div className="flex flex-col">
                <span className="font-semibold">{el.name}</span>
                <span className="">{el.email}</span>
              </div>
            </button>
          ))}
        </aside>
      )}
    </div>
  );
}
