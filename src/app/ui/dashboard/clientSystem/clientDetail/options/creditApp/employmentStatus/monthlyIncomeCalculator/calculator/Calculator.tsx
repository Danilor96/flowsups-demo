import { HorizontalLine } from '&/miscellaneous/separators/HorizontalLine';
import { numberFormatterStore } from '@/store/adminDashboard';
import { useEffect, useState } from 'react';

export function Calculator({
  hourlyWage,
  yearToDate,
  index,
  onChange,
}: {
  hourlyWage: string;
  yearToDate: string;
  index: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  // ----- global states -----

  const { numberFormatter, numberFilter } = numberFormatterStore();

  // ----- local states -----

  const [monthlyIncome, setMonthlyIncome] = useState('0');
  const [monthsWorked, setMonthsWorked] = useState('0');

  useEffect(() => {
    if (hourlyWage) {
      const monthlyIncome = (parseFloat(hourlyWage?.replace(/,/g, '')) * 40 * 52) / 12;

      const formattedValue = numberFormatter(monthlyIncome?.toString());

      const parseVal = parseFloat(formattedValue?.replace(/,/g, ''));

      setMonthlyIncome(parseVal?.toFixed(2));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hourlyWage]);

  useEffect(() => {
    if (yearToDate && yearToDate !== '0' && monthlyIncome) {
      const monthsWorked =
        parseFloat(yearToDate?.replace(/,/g, '')) / parseFloat(monthlyIncome?.replace(/,/g, ''));

      const parseVal = parseFloat(monthsWorked.toString()?.replace(/,/g, ''));

      setMonthsWorked(parseVal?.toFixed(2));
    }
  }, [yearToDate, monthlyIncome]);

  return (
    <article className="absolute bottom-[6vh] left-0 w-full flex flex-col justify-center items-center gap-[0.5vh] px-[0.5vw] py-[0.5vh] rounded-md shadow-crmFormShadow bg-white max-lg:static max-lg:mt-3">
      <aside className="flex flex-col gap-[0.1vh]">
        <label htmlFor="hourlyWage" className="text-[1.8vh] text-primaryColor font-semibold max-lg:text-sm">
          Hourly Wage
        </label>
        <input
          autoComplete="off"
          type="text"
          name="hourlyWage"
          id="hourlyWage"
          value={numberFilter(hourlyWage || '0', 1)}
          onChange={onChange}
          data-index={index}
          className="w-full h-[3vh] border border-primaryColor rounded-md outline-none px-[0.2vw] py-[0.2vh] text-[1.8vh] text-primaryColor !max-lg:text-sm"
        />
      </aside>
      <aside className="flex flex-col gap-[0.1vh]">
        <label htmlFor="yearToDate" className="text-[1.8vh] text-primaryColor font-semibold max-lg:text-sm">
          Year To Date
        </label>
        <input
          autoComplete="off"
          type="text"
          name="yearToDate"
          id="yearToDate"
          value={numberFilter(yearToDate || '0', 1)}
          onChange={onChange}
          data-index={index}
          className="w-full h-[3vh] border border-primaryColor rounded-md outline-none px-[0.2vw] py-[0.2vh] text-[1.8vh] text-primaryColor !max-lg:text-sm"
        />
      </aside>
      <HorizontalLine marginBottom={0.25} marginTop={0.1} />
      <aside className="w-full h-[3vh] flex flex-row justify-between items-center gap-[0.3vw] border border-primaryColor rounded-md outline-none px-[0.2vw] py-[0.2vh] text-[1.8vh] text-primaryColor overflow-hidden !max-lg:text-sm max-lg:h-auto">
        <p className="font-bold pt-[0.1vh]">$/mo:</p>
        <input
          type="text"
          disabled={true}
          name="monthlyIncome"
          id=""
          className="w-full flex pt-[0.1vh] outline-none bg-white"
          value={numberFilter(monthlyIncome, 1)}
        />
      </aside>
      <aside className="w-full h-[3vh] flex flex-row justify-between items-center gap-[0.3vw] border border-primaryColor rounded-md outline-none px-[0.2vw] py-[0.2vh] text-[1.8vh] text-primaryColor overflow-hidden !max-lg:text-sm max-lg:h-auto">
        <p className="font-bold">mo:</p>
        <input
          type="text"
          disabled={true}
          name="monthlyIncome"
          id=""
          className="w-full flex pt-[0.2vh] outline-none bg-white"
          value={monthsWorked}
        />
      </aside>
    </article>
  );
}
