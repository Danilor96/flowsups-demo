import { motion } from 'framer-motion';
import { NextNavigationIcon, PrevNavigationIcon } from '&/icons/Icons';
import { useCalendarStore } from '@/store/monthNavigation';

const yearsInSpan = Array.from({ length: 12 }, (_, i) => i);

export function YearPicker() {
  // ----- global states -----

  const {
    currentYear,
    yearSpanStart,
    isSecondFilterActive,
    currentSecondYear,
    handlePick,
    handleYearSpanNext,
    handleYearSpanPrev,
  } = useCalendarStore();

  // ----- local states -----

  const yearSpanEnd = yearSpanStart + 11;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute top-[120%] right-[50%] translate-x-[50%] z-10 h-[35vh] w-[17vw] rounded-[0.78125vw] bg-[#FFF] shadow-crmFormShadow overflow-hidden"
    >
      <aside className="h-[4.907407vh] bg-[#C9EBE6] flex flex-row justify-center items-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleYearSpanPrev}
          data-prev={true}
          type="button"
          className="w-[1.5vw] flex justify-center items-center hover:bg-[#D4F1ED80] transition-colors ease-in-out rounded-[0.53vw]"
        >
          <PrevNavigationIcon />
        </motion.button>
        <p>{`${yearSpanStart} - ${yearSpanEnd}`}</p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleYearSpanNext}
          data-next={true}
          type="button"
          className="w-[1.5vw] flex justify-center items-center hover:bg-[#D4F1ED80] transition-colors ease-in-out rounded-[0.53vw]"
        >
          <NextNavigationIcon />
        </motion.button>
      </aside>
      <aside className="w-full h-[30vh] grid grid-cols-3 p-[0.5890625vw] justify-items-center">
        {yearsInSpan.map(offset => {
          const yearValue = yearSpanStart + offset;

          return (
            <motion.button
              key={yearValue}
              onClick={e => handlePick('year', parseInt(e.currentTarget.value))}
              data-year={true}
              value={yearValue}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-[3.7vw] h-[6vh] px-[2.2vw] flex justify-center items-center border-[0.052083vw] rounded-[0.520833vw]"
              style={{
                backgroundColor: `${
                  yearValue === (isSecondFilterActive ? currentSecondYear : currentYear) ? '#C9EBE6' : '#FFF'
                }`,
                borderColor: `${
                  yearValue === (isSecondFilterActive ? currentSecondYear : currentYear) ? '#C9EBE6' : '#00A78B'
                }`,
              }}
            >
              {yearValue}
            </motion.button>
          );
        })}
      </aside>
    </motion.div>
  );
}
