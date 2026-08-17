import { adminDashboardStore } from '@/store/adminDashboard';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

export function TimeInput({
  fromName,
  toName,
  label,
  from,
  to,
  width,
  fromWidth,
  toWidth,
  onChange,
  fieldErrors,
}: {
  fromName: string | undefined;
  toName: string | undefined;
  label: string | undefined;
  from: string | undefined;
  to: string | undefined;
  width: number;
  fromWidth: number;
  toWidth: number;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  fieldErrors?: { [key: string]: [string | undefined] };
}) {
  // global states
  const { dayTime } = adminDashboardStore();
  const { getDayTime } = adminDashboardStore();

  useEffect(() => {
    getDayTime();
  }, [getDayTime]);

  // local states

  return (
    <section className="relative flex flex-col">
      <label
        htmlFor={fromName ? fromName : ''}
        className="mb-[1.666667vh] text-[1.626852vh] font-medium text-[#B3B3B3]"
      >
        {label}
      </label>
      <div
        className={`h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] flex flex-row justify-center items-center gap-[1.728646vw] !max-lg:w-full max-lg:h-11 max-lg:gap-2 !max-lg:text-sm`}
        style={{
          width: `${width}vw`,
        }}
      >
        {/* from input */}
        <select
          name={fromName ? fromName : ''}
          id={fromName ? fromName : ''}
          onChange={onChange}
          value={from}
          className={`border-[0.052083vw] border-[#D9D9D9] rounded-[0.3125vw] bg-[#F4F4F4] !max-lg:flex-1`}
          style={{
            width: `${fromWidth}vw`,
          }}
        >
          <option value="">From</option>
          {dayTime &&
            dayTime.length > 0 &&
            dayTime.map((el) => (
              <option key={el.id} value={el.time}>
                {el.time}
              </option>
            ))}
        </select>
        {/* to input */}
        <select
          name={toName ? toName : ''}
          id={toName ? toName : ''}
          onChange={onChange}
          value={to}
          className={`border-[0.052083vw] border-[#D9D9D9] rounded-[0.3125vw] bg-[#F4F4F4] !max-lg:flex-1`}
          style={{
            width: `${toWidth}vw`,
          }}
        >
          <option value="">To</option>
          {dayTime &&
            dayTime.length > 0 &&
            dayTime.map((el) => (
              <option key={el.id} value={el.time}>
                {el.time}
              </option>
            ))}
        </select>
      </div>
      <AnimatePresence>
        {fieldErrors && toName && fieldErrors[toName] && fieldErrors[toName].length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute left-[1.5vw] bottom-[1.8vh] text-[1.666667vh] text-[#F00]"
          >
            {fieldErrors[toName][0]}
          </motion.p>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {fieldErrors && fromName && fieldErrors[fromName] && fieldErrors[fromName].length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute right-[1.5vw] bottom-[1.8vh] text-[1.666667vh] text-[#F00]"
          >
            {fieldErrors[fromName][0]}
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
