import { motion } from 'framer-motion';
import { NextNavigationIcon, PrevNavigationIcon } from '&/icons/Icons';
import { useCalendarStore } from '@/store/monthNavigation';
import { Month } from './month/Month';
import { Year } from './year/Year';
import { Loader } from '../loader/Loader';

export function MonthNavigator() {
  // ----- global states -----

  const { handlePrev, handleNext, fetchingData } = useCalendarStore();

  // ----- local states -----

  return (
    <div className="relative w-[16vw] flex flex-row gap-[0.572917vw]">
      {fetchingData ? (
        <Loader />
      ) : (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            type="button"
            className="w-[10%] flex justify-center items-center hover:bg-[#D4F1ED80] transition-colors ease-in-out rounded-[0.53vw]"
          >
            <PrevNavigationIcon />
          </motion.button>
          <p className="w-[100%] h-[5.462963vh] flex justify-center items-center gap-[0.5vw] px-[1.208333vw] bg-[#C9EBE6] rounded-[0.520833vw] text-[2.777778vh] text-[#00A78B] font-semibold">
            <Month />
            <Year />
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            type="button"
            className="w-[10%] flex justify-center items-center hover:bg-[#D4F1ED80] transition-colors ease-in-out rounded-[0.53vw]"
          >
            <NextNavigationIcon />
          </motion.button>
        </>
      )}
    </div>
  );
}
