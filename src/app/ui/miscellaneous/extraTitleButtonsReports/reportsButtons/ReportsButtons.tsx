import useUiHandler from '@/hooks/closeComponentsHandler';
import { Options } from './options/Options';
import { useState } from 'react';
import { AddNewReportModal } from './addReportModal/AddReportModal';
import { AnimatePresence } from 'framer-motion';
import { FilterableField } from '@/store/customerList/types';

export function ReportsButtons({ filterableFields }: { filterableFields: FilterableField[] }) {
  // ----- global states -----
  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  const [openAddReportModal, setOpenAddReportModal] = useState(false);

  return (
    <div ref={ref} className="relative">
      <button
        className="w-[40px] h-[35px] p-[10px] flex items-center justify-center bg-[#00A78B] rounded-[16px]
        hover:scale-105 transition-all
        "
        onClick={toggleOpen}
      >
        <MoreOptionsIcon />
      </button>
      {isOpen && (
        <Options
          toggleAddReportModal={() => {
            setOpenAddReportModal(!openAddReportModal);
          }}
        />
      )}
      <AnimatePresence>
        {openAddReportModal && (
          <AddNewReportModal
            toggleOpenBtn={() => setOpenAddReportModal(false)}
            filterableFields={filterableFields}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const MoreOptionsIcon = () => {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.07812 12.5C5.07812 11.8528 4.55346 11.3281 3.90625 11.3281C3.25904 11.3281 2.73437 11.8528 2.73437 12.5C2.73437 13.1472 3.25904 13.6719 3.90625 13.6719C4.55346 13.6719 5.07812 13.1472 5.07812 12.5Z"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13.6719 12.5C13.6719 11.8528 13.1472 11.3281 12.5 11.3281C11.8528 11.3281 11.3281 11.8528 11.3281 12.5C11.3281 13.1472 11.8528 13.6719 12.5 13.6719C13.1472 13.6719 13.6719 13.1472 13.6719 12.5Z"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M22.2656 12.5C22.2656 11.8528 21.741 11.3281 21.0937 11.3281C20.4465 11.3281 19.9219 11.8528 19.9219 12.5C19.9219 13.1472 20.4465 13.6719 21.0938 13.6719C21.741 13.6719 22.2656 13.1472 22.2656 12.5Z"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
