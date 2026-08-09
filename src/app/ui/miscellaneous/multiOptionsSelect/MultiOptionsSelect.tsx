import useUiHandler from '@/hooks/closeComponentsHandler';
import { OptionsSelected } from './optionsSelected/OptionsSelected';
import { SelectContent } from './selectContent/SelectContent';
import { AnimatePresence, motion } from 'framer-motion';

export function MultiOptionsSelect({
  label,
  width,
  options,
  optionsSelected,
  fieldErrors,
  name,
  fieldErrorTop,
  fieldErrorWidthMaxContent,
  fieldErrorFontSize,
  fieldErrorBgWhite,
  noOpenItemsList,
  singleSelection,
  optionsShowsTop,
  onClick,
}: {
  label?: string;
  width: number;
  options?: { value: number; option: string }[];
  optionsSelected: string[];
  fieldErrors?: { [key: string]: [string | undefined] };
  name?: string;
  fieldErrorTop?: number;
  fieldErrorWidthMaxContent?: boolean;
  fieldErrorFontSize?: number;
  fieldErrorBgWhite?: boolean;
  noOpenItemsList?: boolean;
  onClick: (value: string[]) => void;
  singleSelection?: boolean;
  optionsShowsTop?: boolean;
}) {
  // ----- global states -----

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  return (
    <section className="relative h-full flex flex-col justify-between">
      {label && (
        <label htmlFor="" className="w-fit h-fit font-medium text-[1.626852vh] text-[#B3B3B3]">
          {label}
        </label>
      )}
      <div ref={ref} className="relative">
        <OptionsSelected
          toggleOpen={toggleOpen}
          width={width}
          options={options}
          isOpen={isOpen}
          optionsSelected={optionsSelected}
        />
        {isOpen && !noOpenItemsList && (
          <SelectContent
            options={options}
            optionsSelected={optionsSelected}
            width={width}
            singleSelection={singleSelection}
            optionsShowsTop={optionsShowsTop}
            onClick={(value) => {
              onClick(value);
              if (singleSelection) toggleOpen();
            }}
          />
        )}
      </div>
      <AnimatePresence>
        {fieldErrors && name && fieldErrors[name] && fieldErrors[name].length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute top-[100%] z-[1] text-[#F00]"
            style={{
              width: fieldErrorWidthMaxContent ? 'max-content' : undefined,
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
}
