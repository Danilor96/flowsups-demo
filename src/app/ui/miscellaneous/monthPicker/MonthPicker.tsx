import { motion } from 'framer-motion';
import { NextNavigationIcon, PrevNavigationIcon } from '&/icons/Icons';
import { useCalendarStore } from '@/store/monthNavigation';
import { dateFormatsStore } from '@/store/dateFormats';

export function MonthPicker() {
  // ----- global states -----

  const { dateFormatted } = dateFormatsStore();

  const {
    handlePick,
    currentMonth,
    currentYear,
    currentSecondMonth,
    currentSecondYear,
    isSecondFilterActive,
    handleNext,
    handlePrev,
  } = useCalendarStore();

  // ----- local states -----

  const getMonthName = (monthIndex: number): string => {
    const date = new Date();
    date.setMonth(monthIndex);
    return dateFormatted(4, date);
  };

  const getShortMonthName = (monthIndex: number): string => {
    const date = new Date();
    date.setMonth(monthIndex);
    return date.toLocaleString('en-US', { month: 'short' });
  };

  const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute top-[120%] right-[50%] translate-x-[50%] z-10 h-[35vh] w-[18vw] rounded-[0.78125vw] bg-[#FFF] shadow-crmFormShadow overflow-hidden"
    >
      <aside className="h-[4.907407vh] bg-[#C9EBE6] flex flex-row justify-center items-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrev}
          type="button"
          className="w-[1.5vw] flex justify-center items-center hover:bg-[#D4F1ED80] transition-colors ease-in-out rounded-[0.53vw]"
        >
          <PrevNavigationIcon />
        </motion.button>
        <p>{`${getMonthName(isSecondFilterActive ? currentSecondMonth : currentMonth)} ${
          isSecondFilterActive ? currentSecondYear : currentYear
        }`}</p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          type="button"
          className="w-[1.5vw] flex justify-center items-center hover:bg-[#D4F1ED80] transition-colors ease-in-out rounded-[0.53vw]"
        >
          <NextNavigationIcon />
        </motion.button>
      </aside>
      <aside className="w-full h-[30vh] grid grid-cols-3 p-[0.5890625vw] justify-items-center">
        {months.map((el) => (
          <motion.button
            key={el}
            onClick={(e) => handlePick('month', parseInt(e.currentTarget.value))}
            data-month={true}
            value={el}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-[3.7vw] h-[6vh] px-[2.2vw] flex justify-center items-center border-[0.052083vw] rounded-[0.520833vw]"
            style={{
              backgroundColor: `${
                (isSecondFilterActive ? currentSecondMonth : currentMonth) === el
                  ? '#C9EBE6'
                  : '#FFF'
              }`,
              borderColor: `${
                (isSecondFilterActive ? currentSecondMonth : currentMonth) === el
                  ? '#C9EBE6'
                  : '#00A78B'
              }`,
            }}
          >
            {getShortMonthName(el)}
          </motion.button>
        ))}
      </aside>
    </motion.div>
  );
}
