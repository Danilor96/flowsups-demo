import { AnimatePresence, motion } from 'framer-motion';
import { ThreeGreenDots } from '&/icons/Icons';
import { useEffect, useState } from 'react';
import { OptionsInput } from '&/inputs/dottedInput/optionsInput/OptionsInput';

export function DottedInput({
  type,
  name,
  label,
  width,
  placeholder,
  value,
  labelRight,
  onChange,
  fieldErrors,
  colGridSpan,
  disabled,
  optionsWidth,
  optionsHeight,
  optionsColumns,
  optionsHeightContentFit,
  optionsColumnsGap,
  optionsRight,
  optionsLeft,
  index,
  optionsTop,
  optionsBottom,
  optionsZIndex,
  optionsInputs,
}: {
  type?: string | undefined;
  name?: string | undefined;
  label?: string | undefined;
  width?: number | undefined;
  colGridSpan?: number;
  placeholder?: string;
  value: string | undefined;
  labelRight?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  fieldErrors?: { [key: string]: [string | undefined] };
  disabled?: boolean;
  optionsWidth: number;
  optionsHeight: number;
  optionsHeightContentFit?: boolean;
  optionsColumns: number;
  optionsColumnsGap: number;
  optionsRight?: boolean;
  optionsLeft?: boolean;
  index?: number;
  optionsTop?: number;
  optionsBottom?: number;
  optionsZIndex?: number;
  optionsInputs: {
    key: number;
    disabled?: boolean;
    label: string;
    value: string;
    name: string;
    colGridSpan?: number;
    marginLeft?: number;
    width: number;
    index?: number;
    type: string;
    options?:
      | {
          value: number | undefined;
          option: string | undefined;
        }[]
      | undefined;
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  }[];
}) {
  // ----- local state -----
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const [errorFound, setErrorFound] = useState<boolean>(false);

  useEffect(() => {
    if (fieldErrors) {
      optionsInputs.map((el) => {
        const inputName = el.name;

        for (const [name, value] of Object.entries(fieldErrors)) {
          if (inputName === name && value[0] !== '') {
            setErrorFound(true);
          } else if (inputName === name && value[0] === '') {
            setErrorFound(false);
          }
        }
      });
    }
  }, [fieldErrors, optionsInputs]);

  return (
    <section
      className="relative flex"
      style={{
        flexDirection: `${labelRight ? 'row-reverse' : 'column'}`,
        justifyContent: `${labelRight && 'center'}`,
        alignItems: `${labelRight && 'center'}`,
        gap: `${labelRight && '1vw'}`,
        width: `${width}vw`,
        gridColumn: colGridSpan ? `span ${colGridSpan}` : 'auto',
      }}
    >
      <label
        htmlFor={name ? name : ''}
        className="text-[1.626852vh] font-medium text-[#B3B3B3]"
        style={{
          marginBottom: `${labelRight ? 0 : '1.666667vh'}`,
        }}
      >
        {label}
      </label>
      <div className="flex flex-row">
        <input
          type={type}
          name={name ? name : ''}
          id={name ? name : ''}
          value={value}
          autoComplete="off"
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          data-index={index}
          className={`w-[85%] h-[5.277778vh] rounded-l-[0.520833vw] outline-none px-[0.6vw] text-[1.666667vh] font-medium text-[#959595] bg-[#F4F4F4] transition-colors ease-in-out ${
            errorFound && 'border-[0.043vw] border-[#F00]'
          }`}
        />
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="w-[15%] flex justify-center items-center rounded-r-[0.520833vw] bg-[#C9EBE6] outline-none"
        >
          <ThreeGreenDots />
        </button>
      </div>
      <AnimatePresence>
        {showOptions && (
          <OptionsInput
            width={optionsWidth}
            height={optionsHeight}
            heightContentFit={optionsHeightContentFit}
            columns={optionsColumns}
            columnsGap={optionsColumnsGap}
            right={optionsRight}
            left={optionsLeft}
            top={optionsTop}
            bottom={optionsBottom}
            zIndex={optionsZIndex}
            inputs={optionsInputs}
            fieldErrors={fieldErrors}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {fieldErrors && name && fieldErrors[name] && fieldErrors[name].length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute bottom-[-2.1vh] text-[1.666667vh] text-[#F00]"
          >
            {fieldErrors[name][0]}
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
