import { Dropdown } from '&/miscellaneous/dropdown/Dropdown';
import {
  FromInventoryFilter,
  OptionsInventoryFilter,
  ToInventoryFilter,
} from '@/app/libs/definitions';
import { Button } from '@/app/ui/buttons/Button';
import { FilterIcon } from '@/app/ui/icons/Icons';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { AnimatePresence, motion } from 'framer-motion';

export function Filter({
  options,
}: {
  options: {
    key: number;
    name: string;
    icon: React.ReactNode;
    onCheckboxChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onLocationChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    options?: OptionsInventoryFilter;
    from?: FromInventoryFilter;
    to?: ToInventoryFilter;
  }[];
}) {
  // ----- global states -----

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  return (
    <div ref={ref}>
      <Button
        width={5.9375}
        identity=""
        backgroundColor="#43B5A1"
        buttonText="Filters"
        iconTextGap={1}
        borderRadius={1.3}
        buttonIcon={<FilterIcon />}
        iconRight={true}
        textColor="#FFF"
        onClick={toggleOpen}
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-[6vh] w-[19vw] max-h-[54vh] flex flex-col gap-[2vh] bg-white rounded-[0.520833vw] shadow-crmFormShadow px-[1.2vw] py-[2.777778vh] overflow-y-scroll"
            style={{
              zIndex: 4,
            }}
          >
            {options.map((el) => (
              <Dropdown
                key={el.key}
                icon={el.icon}
                onCheckboxChange={el.onCheckboxChange}
                onClick={el.onClick}
                text={el.name}
                options={el.options}
                from={el.from}
                to={el.to}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
