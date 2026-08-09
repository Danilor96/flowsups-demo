import { useEffect, useRef, useState } from 'react';
import { AdvancedFilterRow } from './AdvanceFilterRow';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { AppliedFilter } from '@/store/customerList/types';
import { customerListStore } from '@/store/customerList/customerList.store';

interface AdvancedFiltersPanelProps {
  onApplyFilters: (filters: AppliedFilter[]) => void;
  // initialFilters?: AppliedFilter[];
}

export const AdvancedFiltersPanel: React.FC<AdvancedFiltersPanelProps> = ({ onApplyFilters }) => {
  const appliedFilters = customerListStore(state => state.advancedFilters);
  const setAppliedFilters = customerListStore(state => state.setAdvancedFilters);

  // const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>(initialFilters);
  // const [showPanel, setShowPanel] = useState(false);
  const { isOpen, ref, toggleOpen } = useUiHandler();
  const filtersContainerRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   onApplyFilters(appliedFilters);
  // }, [appliedFilters]);
  useEffect(() => {
    if (filtersContainerRef.current) {
      filtersContainerRef.current.scrollTop = filtersContainerRef.current.scrollHeight + 50;
    }
  }, [appliedFilters]);

  const addFilter = () => {
    setAppliedFilters([...appliedFilters, { id: Date.now().toString(), field: '', condition: '', value: null }]);
  };

  const updateFilter = (updatedFilter: AppliedFilter) => {
    setAppliedFilters(appliedFilters.map(f => (f.id === updatedFilter.id ? updatedFilter : f)));
  };

  const removeFilter = (filterId: string) => {
    const newFilters = appliedFilters.filter(f => f.id !== filterId);
    if (newFilters.length === 0) {
      newFilters.push({ id: '0', field: '0', condition: '', value: null });
    }
    setAppliedFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const handleApply = () => {
    const validFilters = appliedFilters.filter(f => f.field && f.condition && f.value !== null && f.value !== '');
    onApplyFilters(validFilters);
    //toggleOpen();
  };

  const handleClearAll = () => {
    setAppliedFilters([{ id: '0', field: '0', condition: '', value: null }]);
    onApplyFilters([]);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => toggleOpen()}
        className="shadow bg-[#00A78B] py-2 px-4 rounded-[20px] font-normal text-sm text-white flex 
        items-center justify-center gap-2 hover:scale-105 transition-all"
      >
        Filters
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3zm3.707 4.707A1 1 0 017 7h6a1 1 0 01.707.293l-3 3a1 1 0 01-1.414 0l-3-3z"
            clipRule="evenodd"
          />
        </svg>
        {appliedFilters.filter(f => f.field && f.condition && f.value !== null).length > 0 &&
          `(${appliedFilters.filter(f => f.field && f.condition && f.value !== null).length})`}
      </button>

      {isOpen && (
        <div
          className={`absolute z-20 top-full mt-2 min-w-[400px] max-w-[800px] right-0 p-4 border border-gray-300 rounded-lg shadow-lg bg-white`}
        >
          <div
            id="container-advanced-filters"
            ref={filtersContainerRef}
            className="max-h-[30vh] overflow-auto scroll-smooth"
          >
            {appliedFilters.map(filter => (
              <AdvancedFilterRow key={filter.id} filter={filter} onUpdate={updateFilter} onRemove={removeFilter} />
            ))}
          </div>
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
            <button
              onClick={addFilter}
              className="w-full sm:w-auto bg-[#00A78B] hover: py-2 px-4 text-white font-normal rounded-[10px] shadow"
            >
              Add New Filter
            </button>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={handleClearAll}
                className="w-full sm:w-auto bg-gray-200 hover:bg-gray-400 text-gray-600 font-semibold py-2 px-4 rounded-[10px] shadow"
              >
                Clear All
              </button>
              <button
                onClick={handleApply}
                className="w-full sm:w-auto bg-[#00A78B] py-2 px-4 text-white font-normal rounded-[10px] shadow"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
