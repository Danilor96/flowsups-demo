import useUiHandler from '@/hooks/closeComponentsHandler';
import { motion } from 'framer-motion';
import React from 'react';

interface SortConfig {
  key: string | null;
  direction: 'ascending' | 'descending' | null;
}

interface SortOption {
  id: string;
  label: string;
  type: string;
}

interface SortButtonsProps {
  sortOptions: SortOption[];
  sortConfig: SortConfig;
  sortHandler: (key: string) => void;
  clearSort: () => void;
}

export const SortButtons: React.FC<SortButtonsProps> = ({
  sortOptions,
  sortConfig,
  sortHandler,
  clearSort,
}) => {
  const { isOpen, ref, toggleOpen } = useUiHandler();

  const requestSort = (key: string) => {
    sortHandler(key);
  };

  const handleClearSort = () => {
    clearSort();
  };

  const mainArrowClass =
    sortConfig.direction === 'ascending' && sortConfig.key !== null ? 'rotate-180' : '';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={toggleOpen}
        className="self-end justify-self-end place-self-end h-fit shadow
                   bg-[#00A78B] py-2 px-4 rounded-[20px] font-normal text-sm text-white flex items-center 
                   justify-center gap-2 hover:scale-105 transition-all"
      >
        <span>Sort</span>
        <svg
          width="18"
          height="15"
          viewBox="0 0 20 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={mainArrowClass}
        >
          <path
            d="M17 0V12H20L16 17L12 12H15V0H17ZM9 14V16H0V14H9ZM11 7V9H0V7H11ZM11 0V2H0V0H11Z"
            fill="white"
          />
        </svg>
      </button>
      {isOpen && (
        <motion.div
          transition={{ duration: 0.2 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute z-20 top-full mt-2 min-w-[14.5rem] right-0 bg-white rounded-md shadow-xl border border-gray-200"
        >
          <ul className="py-1">
            {sortOptions.map((option) => (
              <li key={option.id}>
                <button
                  onClick={() => requestSort(option.id)}
                  className={`w-full text-left px-4 py-2 text-sm text-[#00A78B] hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 flex items-center justify-between ${
                    sortConfig.key === option.id ? 'bg-gray-100 font-semibold' : ''
                  }`}
                >
                  {option.label}
                  {sortConfig.key === option.id && (
                    <span className="ml-2 text-xs flex items-center gap-1 text-gray-700">
                      {sortConfig.direction === 'ascending' ? '(Asc)' : '(Desc)'}
                      <svg
                        width="18"
                        height="15"
                        viewBox="0 0 20 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-4 h-4 transition-transform ${
                          sortConfig.direction === 'ascending' ? 'rotate-180' : ''
                        }`}
                      >
                        <path
                          d="M17 0V12H20L16 17L12 12H15V0H17ZM9 14V16H0V14H9ZM11 7V9H0V7H11ZM11 0V2H0V0H11Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              </li>
            ))}
            <li className="border-t border-gray-200">
              <button
                onClick={handleClearSort}
                className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:bg-gray-100"
              >
                Clear Sort
              </button>
            </li>
          </ul>
        </motion.div>
      )}
    </div>
  );
};
