import useUiHandler from '@/hooks/closeComponentsHandler';
import { dateFormatsStore } from '@/store/dateFormats';
import { useCalendarStore } from '@/store/monthNavigation';
import { AnimatePresence, motion } from 'framer-motion';
import { MonthPicker } from '&/miscellaneous//monthPicker/MonthPicker';

export function Month() {
  // ----- global states -----

  const { dateFormatted } = dateFormatsStore();

  const { currentMonth, currentSecondMonth, isSecondFilterActive } = useCalendarStore();

  // ----- local states -----

  const getMonthName = (monthIndex: number): string => {
    const date = new Date();
    date.setMonth(monthIndex);
    return dateFormatted(4, date);
  };

  const { isOpen, ref, toggleOpen } = useUiHandler();

  return (
    <div ref={ref} className="relative w-fit">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleOpen}
        type="button"
        className="w-fit h-fit"
      >{`${getMonthName(isSecondFilterActive ? currentSecondMonth : currentMonth)}`}</motion.button>
      <AnimatePresence>{isOpen && <MonthPicker />}</AnimatePresence>
    </div>
  );
}
