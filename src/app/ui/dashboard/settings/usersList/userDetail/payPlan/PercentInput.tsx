import { AnimatePresence, motion } from 'framer-motion';

interface props {
  name?: string;
  label?: string;
  value?: string;
  width?: number;
  widthFull?: boolean;
  labelFontSize?: number;
  placeholder?: string;
  type?: 'money' | 'percent';
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  identity?: string;
  fieldErrors?: {
    [key: string]: [string | undefined];
  };
  fieldErrorWidthMaxContent?: boolean;
  fieldErrorTop?: number;
  fieldErrorFontSize?: number;
  fieldErrorBgWhite?: boolean;
}

const DecimalInput = ({
  name,
  label,
  value,
  onChange,
  identity,
  width,
  widthFull,
  labelFontSize,
  placeholder,
  type,
  fieldErrors,
  fieldErrorWidthMaxContent,
  fieldErrorTop,
  fieldErrorFontSize,
  fieldErrorBgWhite,
}: props) => {
  return (
    <section
      className="relative flex flex-col"
      style={{
        width: widthFull ? '100%' : '',
      }}
    >
      <label
        htmlFor={name ? name : ''}
        className="mb-[1.666667vh] text-[1.626852vh] font-medium text-[#B3B3B3] lg:text-[2vh]"
        style={{ fontSize: labelFontSize ? `${labelFontSize}vh` : '1.626852vh' }}
      >
        <p>
          {label}
          {/* <span className="text-red-500">*</span> */}
        </p>
      </label>
      <div
        className="relative w-full h-[5.277778vh] !max-lg:w-full max-lg:h-11"
        style={{
          width: width !== 0 ? `${width}vw` : '100%',
        }}
      >
        <input
          type="number"
          name={name}
          id={name}
          value={value ? value : ''}
          onChange={onChange}
          className={`w-full h-full bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-gray-600 font-medium leading-[1.805555vh] pl-[1.041666vw] outline-none !max-lg:text-sm 
            ${type === 'percent' ? 'text-right pr-8' : 'text-left pl-[1.8rem]'}
            `}
          data-identity={identity}
          step="0.01"
          min="0"
          inputMode="decimal"
          placeholder={placeholder ? placeholder : ''}
        />
        <span
          className={`absolute top-[50%] translate-y-[-50%] text-gray-600
                ${type === 'percent' ? 'right-[1vw]' : 'left-[1vw]'}
            `}
        >
          {' '}
          {type === 'percent' ? '%' : type === 'money' ? '$' : ''}
        </span>
      </div>
      <AnimatePresence>
        {fieldErrors && name && fieldErrors[name] && fieldErrors[name].length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute z-[1] text-[#F00]"
            style={{
              width: fieldErrorWidthMaxContent ? 'max-content' : undefined,
              top: fieldErrorTop ? `${fieldErrorTop}vh` : '9.5vh',
              fontSize: fieldErrorFontSize ? `${fieldErrorFontSize}vh` : '1.666667vh',
              backgroundColor: fieldErrorBgWhite ? '#FFF' : '',
            }}
          >
            {fieldErrors[name][0]}
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
};

export default DecimalInput;
