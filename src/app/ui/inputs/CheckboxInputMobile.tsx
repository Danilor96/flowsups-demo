import { AnimatePresence, motion } from 'framer-motion';

export function CheckboxInputMobile({
  name,
  value,
  chekcboxText,
  fieldErrors,
  onChange,
}: {
  name: string;
  value?: string | null;
  chekcboxText: string;
  fieldErrors?: { [key: string]: [string | undefined] };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <section className="relative flex flex-col">
      <div className="w-full flex flex-row items-start md:items-center">
        <input
          type="checkbox"
          name={name}
          id={name}
          value={value ? value : ''}
          onChange={onChange}
          checked={value ? true : false}
          className="w-[10%] md:w-[2.5vw] lg:w-[1.8vw] h-[6vw] accent-[#00A78B] outline-none"
        />
        <p className="ml-[1vw] w-[90%] text-[2vh] font-medium text-[#B3B3B3] md:w-full text-wrap lg:text-[2.2vh] lg:text-[#6e6e6e]">
          {chekcboxText}
        </p>
      </div>
      <AnimatePresence>
        {fieldErrors && name && fieldErrors[name] && fieldErrors[name].length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="md:absolute bottom-[-2.5vh] md:bottom-[-1.5vh] lg:bottom-[1vh] text-[1.666667vh] text-[#F00] text-wrap lg:text-[1.9vh]"
          >
            {fieldErrors[name][0]}
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
