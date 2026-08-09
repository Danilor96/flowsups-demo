import { AnimatePresence, motion } from 'framer-motion';

export function SelectMobile({
  value,
  label,
  name,
  dataOption,
  fieldErrors,
  onChange,
}: {
  value?: string | null;
  label: string;
  name: string | undefined;
  dataOption: { id: number | undefined; value: string | undefined }[];
  fieldErrors?: { [key: string]: [string | undefined] };
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="relative flex flex-col md:w-[40vw] lg:w-[20vw]">
      <label
        htmlFor="clientAddressState"
        className="mb-[1.666667vh] text-[1.626852vh] font-medium text-[#6e6e6e] lg:text-[2vh]"
      >
        <p>
          {label}
          <span className="text-red-500">*</span>
        </p>
      </label>
      <select
        onChange={onChange}
        value={value ? value : ''}
        name={name}
        id={name}
        className="w-[95vw] md:w-full h-[5.277778vh] rounded-[1.5vw] bg-[#F4F4F4] outline-none px-[0.6vw] text-[1.666667vh] font-medium text-[#959595] lg:text-[2vh]"
      >
        {dataOption &&
          dataOption.map((el, index) => (
            <option key={`${el.id}selectmobile${133 + index}`} value={el.id}>
              {el.value}
            </option>
          ))}
      </select>
      <AnimatePresence>
        {fieldErrors && name && fieldErrors[name] && fieldErrors[name].length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute top-[9.8vh] text-[1.666667vh] text-[#F00]"
          >
            {fieldErrors[name][0]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
