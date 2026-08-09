import { AnimatePresence, motion } from 'framer-motion';

export function InputMobile({
  type,
  name,
  label,
  value,
  onChange,
  fieldErrors,
}: {
  type: string | undefined;
  name: string | undefined;
  label: string | undefined;
  value?: string | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fieldErrors?: { [key: string]: [string | undefined] };
}) {
  const today = new Date();
  const year = today.getFullYear() - 18;
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const maxDate = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;

  return (
    <section className="relative flex flex-col md:w-[40vw] lg:w-[20vw]">
      <label
        htmlFor={name ? name : ''}
        className="mb-[1.666667vh] text-[1.626852vh] font-medium text-[#6e6e6e] lg:text-[2vh]"
      >
        <p>
          {label}
          <span className="text-red-500">*</span>
        </p>
      </label>
      <input
        type={type}
        name={name ? name : ''}
        id={name ? name : ''}
        value={value ? value : ''}
        autoComplete="off"
        onChange={onChange}
        max={type === 'date' ? maxDate : undefined}
        className="w-[95vw] md:w-full h-[5.277778vh] rounded-[1.5vw] bg-[#F4F4F4] outline-none px-[0.6vw] text-[1.666667vh] font-medium text-[#959595] lg:text-[2vh]"
      />
      <AnimatePresence>
        {fieldErrors && name && fieldErrors[name] && fieldErrors[name].length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute bottom-[-2.5vh] text-[1.666667vh] text-[#F00]"
          >
            {fieldErrors[name][0]}
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
