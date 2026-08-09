import React, { useState } from 'react';
import { SearchLensGreen, UsersIcon } from '../../icons/Icons';
import { handlingCapitalWords } from '@/app/libs/functions/inputs/inputsFunction';

interface GenericListSearchProps<T> {
  options: T[];
  selectedIds: string[];
  toggleOption: (id: string) => void;
  getOptionLabel: (option: T) => string;
  getOptionId: (option: T) => string;
  renderOption: (option: T, isSelected: boolean, toggle: () => void) => React.ReactNode;
  capitalWords?: boolean;
  moveSelectedToTop?: boolean;
  loading?: boolean;
  getSearchLabel?: (option: T) => string;
}

export function GenericListSearch<T>({
  options,
  selectedIds,
  toggleOption,
  getOptionLabel,
  getOptionId,
  renderOption,
  capitalWords,
  moveSelectedToTop,
  loading = false,
  getSearchLabel,
}: GenericListSearchProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');

  const searchFn = getSearchLabel || getOptionLabel;

  let filteredOptions = options.filter((option) =>
    searchFn(option).toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (moveSelectedToTop && searchTerm === '') {
    filteredOptions = [...filteredOptions].sort((a, b) => {
      const aSelected = selectedIds.includes(getOptionId(a));
      const bSelected = selectedIds.includes(getOptionId(b));
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  }

  return (
    <>
      {/* Header */}
      <div className="p-3 border-b border-slate-100 bg-white sticky top-0 z-10">
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors">
            <SearchLensGreen />
          </div>
          <input
            autoFocus
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-transparent rounded-lg focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-slate-400 text-slate-700"
            value={capitalWords ? handlingCapitalWords(searchTerm) : searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
        {loading ? (
          <div className="w-full flex justify-center items-center py-5">
            <div className="z-50 ml-2 animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-white text-[#00A78B] rounded-full"></div>
          </div>
        ) : filteredOptions.length > 0 ? (
          <>
            {filteredOptions.map((option, index) => {
              const id = getOptionId(option);
              const isSelected = selectedIds.includes(id);
              return <div key={id}>{renderOption(option, isSelected, () => toggleOption(id))}</div>;
            })}
          </>
        ) : (
          <div className="py-8 text-center text-slate-400 flex flex-col items-center">
            <div className="opacity-50">
              <UsersIcon color="#ccfbf1" />
            </div>
            <p className="text-sm">Not found</p>
          </div>
        )}
      </div>
    </>
  );
}
