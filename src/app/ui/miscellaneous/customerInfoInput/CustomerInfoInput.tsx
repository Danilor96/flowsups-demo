import { ThreeGreenDots } from '&/icons/Icons';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { ExtendedInfo } from './extendedInfo/ExtendedInfo';
import { AnimatePresence, motion } from 'framer-motion';
import { handlingCapitalWords } from '@/app/libs/functions/inputs/inputsFunction';

export function CustomerInfoInput({
  width,
  name,
  nameLastname,
  firstname,
  salutation,
  nickname,
  middleInitials,
  lastname,
  suffix,
  fieldErrors,
  fieldErrorWidthMaxContent,
  fieldErrorBottom,
  disabled,
  noDisabledBgColor,
  onChange,
}: {
  width: number;
  name: string;
  nameLastname: string;
  firstname: string;
  salutation: string;
  nickname: string;
  middleInitials: string;
  lastname: string;
  suffix: string;
  fieldErrors?: { [key: string]: [string | undefined] };
  fieldErrorWidthMaxContent?: boolean;
  fieldErrorBottom?: number;
  disabled?: boolean;
  noDisabledBgColor?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  return (
    <div
      className="relative flex flex-col"
      style={{
        width: `${width}vw`,
      }}
    >
      <label
        htmlFor={name}
        className="w-fit mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
      >
        Name and Last Name
      </label>
      <aside ref={ref} className="relative flex flex-row">
        <input
          type="text"
          name={name}
          id={name}
          value={handlingCapitalWords(nameLastname)}
          onChange={onChange}
          disabled={disabled}
          className={`w-[90%] h-[5.277778vh] rounded-l-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw] outline-none ${
            disabled && !noDisabledBgColor ? 'bg-[#C9EBE6]' : 'bg-[#F4F4F4]'
          }`}
        />
        <button
          onClick={toggleOpen}
          type="button"
          className={`w-[10%] h-[5.277778vh] flex justify-center items-center rounded-r-[0.520833vw] ${
            disabled ? 'bg-[#C9EBE6]' : 'bg-[#F4F4F4]'
          }`}
        >
          <ThreeGreenDots />
        </button>
        <AnimatePresence>
          {isOpen && !disabled && (
            <ExtendedInfo
              firstname={firstname}
              salutation={salutation}
              nickname={nickname}
              middleInitials={middleInitials}
              lastname={lastname}
              suffix={suffix}
              onChange={onChange}
            />
          )}
        </AnimatePresence>
      </aside>
      <AnimatePresence>
        {fieldErrors && name && fieldErrors[name] && fieldErrors[name].length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute text-[1.666667vh] text-[#F00]"
            style={{
              width: fieldErrorWidthMaxContent ? 'max-content' : undefined,
              bottom: fieldErrorBottom ? `${fieldErrorBottom}vh` : '-2.1vh',
            }}
          >
            {fieldErrors[name][0]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
