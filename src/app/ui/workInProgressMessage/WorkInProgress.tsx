/* eslint-disable react-hooks/exhaustive-deps */
import { modalWindowStore } from '@/store/adminDashboard';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

export function WorkInProgress() {
  const { closeWorkInProgress } = modalWindowStore();

  useEffect(() => {
    setTimeout(() => {
      closeWorkInProgress();
    }, 6000);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-[31.197917vw] h-[11.296296vh] fixed top-[3vh] right-[2vw] z-[200] bg-white flex justify-center items-center px-[1.5vw] py-[2vh] shadow-crmFormShadow rounded-[0.58vw]"
    >
      <p className="w-fit text-[2vh] font-medium leading-[1.805556vh] text-gray-900">
        Sorry, this function or component is under development.
      </p>
    </motion.section>
  );
}
