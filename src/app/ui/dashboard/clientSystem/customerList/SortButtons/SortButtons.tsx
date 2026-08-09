import useUiHandler from '@/hooks/closeComponentsHandler';
import { AnimatePresence, motion } from 'framer-motion';
import { SortableClientKey, SortConfig, SortOption } from '../useSortTable';

interface props {
  sortConfig: SortConfig;
  requestSort: (key: SortableClientKey) => void;
  setSortConfig: (sortConfig: SortConfig) => void;
  sortOptions: SortOption[];
}

const SortButtons = ({ sortConfig, requestSort, setSortConfig, sortOptions = [] }: props) => {
  const { isOpen, ref, toggleOpen } = useUiHandler();

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
          className={`${sortConfig.direction === 'ascending' ? 'rotate-180' : ''}`}
        >
          <path d="M17 0V12H20L16 17L12 12H15V0H17ZM9 14V16H0V14H9ZM11 7V9H0V7H11ZM11 0V2H0V0H11Z" fill="white" />
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
            {sortOptions.sort((a, b) => a.label.localeCompare(b.label)).map(option => (
              <li key={option.value}>
                <button
                  onClick={() => requestSort(option.value)}
                  className={`w-full text-left px-4 py-2 text-sm text-[#00A78B] hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 flex items-center ${
                    sortConfig.key === option.value ? 'bg-gray-100 font-semibold' : ''
                  }`}
                >
                  {option.label}
                  {sortConfig.key === option.value && (
                    <span className="ml-2 text-xs flex gap-2">
                      {sortConfig.direction === 'ascending' ? '(Asc)' : '(Desc)'}
                      <svg
                        width="18"
                        height="15"
                        viewBox="0 0 20 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={` hover:scale-105 transition-all ${
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
                onClick={() => {
                  setSortConfig({ key: null, direction: 'ascending' });
                }}
                className="w-full text-left px-4 py-2 text-sm text-[#00A78B] hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100"
              >
                Clear
              </button>
            </li>
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default SortButtons;
