import { SelectDropIcon, UsaFlagIcon } from '&/icons/Icons';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export function PhoneNumberInput({
  name,
  countryName,
  width,
  label,
  countryWidth,
  numberWidth,
  value,
  countryValue,
  fieldErrors,
  onChange,
}: {
  name: string;
  countryName: string;
  width: number;
  label: string;
  countryWidth: number;
  numberWidth: number;
  value: string | undefined;
  countryValue: string | undefined;
  onChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) => void;
  fieldErrors?: { [key: string]: [string | undefined] };
}) {
  const [showCountries, setShowCountries] = useState<boolean>(false);

  return (
    <section className="relative flex flex-col">
      <label
        htmlFor={name}
        className="mb-[1.666667vh] text-[1.626852vh] font-medium text-[#B3B3B3]"
      >
        {label}
      </label>
      <div
        className={`relative h-[5.277778vh] flex flex-row !max-lg:w-full max-lg:h-11`}
        style={{
          width: `${width}vw`,
        }}
      >
        <button
          onClick={() => setShowCountries(!showCountries)}
          className={`h-full bg-[#F4F4F4] rounded-l-[0.520833vw] border-r-[0.052083vw] border-[#D9D9D9] flex flex-row justify-end items-center pr-[0.5vw]`}
          style={{
            width: `${countryWidth}%`,
          }}
        >
          {countryValue && countryValue === '1' ? (
            <p className="flex flex-row justify-around items-center mr-[0.5vw]">
              <UsaFlagIcon />
              <p className="text-[1.9vh] font-medium text-[#959595]">+1</p>
            </p>
          ) : (
            ''
          )}
          <SelectDropIcon />
        </button>
        {showCountries && (
          <ul
            className={`absolute left-0 bottom-[-5vh] z-10 h-fit shadow-crmFormShadow bg-[#FFF]`}
            style={{
              width: `${countryWidth}%`,
            }}
          >
            <li className="w-full">
              <button
                name={countryName}
                id={countryName}
                data-opt={1}
                onClick={(e) => {
                  setShowCountries(false);
                  onChange(e);
                }}
                className="w-full h-[5vh] py-[1vh] flex flex-row justify-around items-center hover:bg-[#C9EBE6] transition-colors ease-in-out px-[1vw]"
              >
                <UsaFlagIcon />
                <p className="text-[1.9vh] font-medium text-[#959595]">+1</p>
              </button>
            </li>
          </ul>
        )}

        <input
          type="text"
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          maxLength={14}
          autoComplete="off"
          pattern="\d*"
          className={`h-full rounded-r-[0.520833vw] bg-[#F4F4F4] outline-none px-[0.6vw] text-[1.666667vh] font-medium text-[#959595] !max-lg:text-sm`}
          style={{
            width: `${numberWidth}%`,
          }}
        />
      </div>
      <AnimatePresence>
        {fieldErrors && name && fieldErrors[name] && fieldErrors[name].length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute right-[2vw] bottom-[-2.2vh] text-[1.666667vh] text-[#F00]"
          >
            {fieldErrors[name][0]}
          </motion.p>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {fieldErrors &&
          countryName &&
          fieldErrors[countryName] &&
          fieldErrors[countryName].length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute left-0 bottom-[-2.2vh] text-[1.666667vh] text-[#F00]"
            >
              {fieldErrors[countryName][0]}
            </motion.p>
          )}
      </AnimatePresence>
    </section>
  );
}
