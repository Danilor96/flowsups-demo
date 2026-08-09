import { useState } from 'react';
import { DropdownClosedIcon, DropdownOpenedIcon } from '&/icons/Icons';
import { CustomCheckbox } from '&/inputs/customCheckbox/CustomCheckbox';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from '&/inputs/Input';
import {
  FromInventoryFilter,
  OptionsInventoryFilter,
  ToInventoryFilter,
} from '@/app/libs/definitions';

export function Dropdown({
  icon,
  text,
  options,
  onCheckboxChange,
  onClick,
  from,
  to,
}: {
  text: string;
  icon: React.ReactNode;
  options: OptionsInventoryFilter;
  from: FromInventoryFilter;
  to: ToInventoryFilter;
  onCheckboxChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const [opened, setOpened] = useState<boolean>(false);

  return (
    <div className="w-full">
      <button className="flex flex-row gap-[1vw] items-center" onClick={() => setOpened(!opened)}>
        {!opened && <DropdownClosedIcon />}
        {opened && <DropdownOpenedIcon />}
        <p className="w-fit h-fit flex flex-row gap-[0.5vw] items-center text-[2vh] text-[#00A78B]">
          <span>{icon}</span>
          {text}
        </p>
      </button>
      <AnimatePresence>
        {opened &&
          (options && onCheckboxChange && onClick ? (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-[1.5vh] ml-[0.8vw] flex flex-col gap-[1vh] overflow-hidden overflow-y-scroll"
            >
              {options &&
                options.length > 0 &&
                options.map((el) => (
                  <li key={el.key}>
                    <CustomCheckbox
                      text={el.name}
                      checked={el.checked}
                      datakey={el.key}
                      onCheckboxChange={onCheckboxChange}
                      onClick={onClick}
                      identity={el.identity}
                    />
                  </li>
                ))}
            </motion.ul>
          ) : from && to ? (
            <motion.aside
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-fit flex flex-row justify-between items-center"
            >
              <Input
                label={from.label}
                name={from.name}
                onChange={from.onChange}
                type={from.type}
                value={from.value}
                width={from.width}
                placeholder={from.placeholder}
              />
              <Input
                label={to.label}
                name={to.name}
                onChange={to.onChange}
                type={to.type}
                value={to.value}
                width={to.width}
                placeholder={to.placeholder}
              />
            </motion.aside>
          ) : (
            from &&
            !to && (
              <motion.aside
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-fit flex flex-row justify-center items-center"
              >
                <Input
                  label={from.label}
                  name={from.name}
                  onChange={from.onChange}
                  type={from.type}
                  value={from.value}
                  width={from.width}
                  placeholder={from.placeholder}
                />
              </motion.aside>
            )
          ))}
      </AnimatePresence>
    </div>
  );
}
