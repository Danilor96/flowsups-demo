import { AnimatePresence, motion } from 'framer-motion';

export function TextAreaInput({
  name,
  label,
  width,
  height,
  value,
  onChange,
  fieldErrors,
  ref,
  widthFull,
  placeholder,
  marginTop,
  index,
  disabled,
}: {
  name: string | undefined;
  label: string | undefined;
  width: number | undefined;
  widthFull?: boolean;
  placeholder?: string;
  height?: number | undefined;
  value: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  fieldErrors?: { [key: string]: [string | undefined] };
  ref?: React.RefObject<HTMLTextAreaElement>;
  marginTop?: number;
  index?: number;
  disabled?: boolean;
}) {
  return (
    <section
      className="relative flex flex-col"
      style={{
        width: widthFull ? '100%' : '',
        marginTop: `${marginTop}vh`,
      }}
    >
      {label && (
        <label
          htmlFor={name ? name : ''}
          className="mb-[1.666667vh] text-[1.626852vh] font-medium text-[#B3B3B3]"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        name={name ? name : ''}
        id={name ? name : ''}
        value={value}
        autoComplete="off"
        onChange={onChange}
        placeholder={placeholder}
        data-index={index}
        disabled={disabled}
        className="rounded-[0.520833vw] bg-[#F4F4F4] outline-none px-[0.6vw] py-[0.8vh] text-[1.666667vh] text-[#585858] font-medium placeholder:text-[#959595] resize-none !max-lg:w-full !max-lg:text-sm max-lg:px-3"
        style={{
          width: width
            ? width !== 0
              ? `${width}vw`
              : widthFull
              ? '100%'
              : ''
            : widthFull
            ? '100%'
            : '',
          height: height ? `${height}vh` : '5.277778vh',
        }}
      />
      <AnimatePresence>
        {fieldErrors && name && fieldErrors[name] && fieldErrors[name].length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute top-[100%] text-[1.666667vh] text-[#F00]"
          >
            {fieldErrors[name][0]}
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
