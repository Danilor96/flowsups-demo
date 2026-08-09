import { AnimatePresence, motion } from 'framer-motion';

export function BusinessAddressInput({
  name,
  label,
  rows,
  width,
  value,
  fieldErrors,
  onChange,
}: {
  name: string | undefined;
  label: string;
  width: number;
  rows: number;
  value: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  fieldErrors?: { [key: string]: [string | undefined] };
}) {
  return (
    <section className="relative flex flex-col">
      <label
        htmlFor={name ? name : ''}
        className="mb-[1.666667vh] text-[1.626852vh] font-medium text-[#B3B3B3]"
      >
        {label}
      </label>
      <textarea
        name={name ? name : ''}
        id={name ? name : ''}
        rows={rows}
        autoComplete="off"
        value={value}
        onChange={onChange}
        className={`rounded-[0.520833vw] bg-[#F4F4F4] resize-none px-[0.6vw] py-[0.5vh] text-[1.666667vh] font-medium text-[#959595] outline-none`}
        style={{
          width: `${width}vw`,
        }}
      ></textarea>
      <AnimatePresence>
        {fieldErrors && name && fieldErrors[name] && fieldErrors[name].length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute left-0 bottom-[-2.2vh] text-[1.666667vh] text-[#F00]"
          >
            {fieldErrors[name][0]}
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
