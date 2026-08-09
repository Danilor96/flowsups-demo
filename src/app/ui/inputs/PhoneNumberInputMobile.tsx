import { SelectDropIcon, UsaFlagIcon } from '&/icons/Icons';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export function PhoneNumberInputMobile({
  name,
  countryName,
  label,
  value,
  countryValue,
  fieldErrors,
  onChange,
}: {
  name: string;
  countryName: string;
  label: string;
  value?: string | null;
  countryValue: string | undefined;
  onChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) => void;
  fieldErrors?: { [key: string]: [string | undefined] };
}) {
  const [showCountries, setShowCountries] = useState<boolean>(false);

  // formatting phone number function

  const formatPhoneNumber = (phoneNumber: string) => {
    const numericValue = phoneNumber.replace(/\D/g, '');

    const match = numericValue.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

    let newValue = '';

    if (match) {
      const part1 = match[1] ? `(${match[1]}` : '';
      const part2 = match[2] ? `) ${match[2]}` : '';
      const part3 = match[3] ? `-${match[3]}` : '';

      newValue = `${part1}${part2}${part3}`;
    }

    return newValue;
  };

  return (
    <section className="relative flex flex-col md:w-[40vw] lg:w-[20vw]">
      <label
        htmlFor={name}
        className="mb-[1.666667vh] text-[1.626852vh] font-medium text-[#6e6e6e] lg:text-[2vh]"
      >
        <p>
          {label}
          <span className="text-red-500">*</span>
        </p>
      </label>
      <div className={`relative w-[95vw] h-[5.277778vh] flex flex-row md:w-full`}>
        <button
          onClick={() => setShowCountries(!showCountries)}
          className={`w-[15%] md:w-[20%] h-full bg-[#F4F4F4] rounded-l-[1.5vw] border-r-[0.052083vw] border-[#D9D9D9] flex flex-row justify-end items-center pr-[0.5vw]`}
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
            className={`absolute left-0 bottom-[-5vh] z-10 w-[15%] md:w-[20%] h-fit shadow-crmFormShadow bg-[#FFF]`}
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
          value={value ? formatPhoneNumber(value) : ''}
          onChange={onChange}
          maxLength={14}
          autoComplete="off"
          pattern="\d*"
          className="w-[85%] md:w-[80%] h-full rounded-r-[1.5vw] bg-[#F4F4F4] outline-none px-[0.6vw] text-[1.666667vh] font-medium text-[#959595] lg:text-[2vh]"
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
