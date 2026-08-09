import { LoadingIcon } from '&/icons/Icons';
import { AnimatePresence, motion } from 'framer-motion';

export function EndVisitInput({
  name,
  onChange,
  value,
  label,
  width,
  fieldErrors,
  fieldErrorBottom,
  loading,
  fieldErrorWidthMaxContent,
  placeholder,
}: {
  name: string;
  value: string;
  label: string;
  width?: number;
  fieldErrors?: { [key: string]: [string | undefined] };
  fieldErrorWidthMaxContent?: boolean;
  fieldErrorBottom?: number;
  loading?: boolean;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <aside className="relative flex flex-row gap-[0.3vw] items-center">
      <label htmlFor={name} className="text-[1.5vh] text-[#41B4A0] font-bold">
        {label}:
      </label>
      <input
        type="text"
        name={name}
        id={name}
        autoComplete="off"
        className="text-[1.5vh] text-[#41B4A0] px-[0.08rem] border border-white hover:border-primaryColor focus:border-primaryColor transition-colors outline-none"
        style={{
          width: width ? `${width}vw` : '100%',
        }}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <AnimatePresence>
        {fieldErrors && name && fieldErrors[name] && fieldErrors[name].length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute z-10 text-[1.666667vh] text-[#F00] bg-white px-[0.2vw] rounded-md"
            style={{
              width: fieldErrorWidthMaxContent ? 'max-content' : undefined,
              bottom: fieldErrorBottom ? `${fieldErrorBottom}vh` : '-2.1vh',
            }}
          >
            {fieldErrors[name][0]}
          </motion.p>
        )}
      </AnimatePresence>
      <span className="absolute right-0 animate-spin">{loading && <LoadingIcon />}</span>
    </aside>
  );
}
