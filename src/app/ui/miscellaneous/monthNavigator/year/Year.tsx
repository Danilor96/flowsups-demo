import useUiHandler from '@/hooks/closeComponentsHandler';
import { useCalendarStore } from '@/store/monthNavigation';
import { AnimatePresence, motion } from 'framer-motion';
import { YearPicker } from '&/miscellaneous/yearPicker/YearPicker';

export function Year() {
  // ----- global states -----

  const { currentYear, isSecondFilterActive, currentSecondYear } = useCalendarStore();

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  return (
    <div ref={ref} className="relative w-fit">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleOpen}
        type="button"
        className="w-fit h-fit"
      >{`${isSecondFilterActive ? currentSecondYear : currentYear}`}</motion.button>
      <AnimatePresence>{isOpen && <YearPicker />}</AnimatePresence>
    </div>
  );
}
