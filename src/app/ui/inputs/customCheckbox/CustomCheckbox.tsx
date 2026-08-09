import { CheckedIcon, GreenCancelIcon } from '&/icons/Icons';
import { motion } from 'framer-motion';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';

export function CustomCheckbox({
  text,
  icon,
  iconBorder,
  total,
  checked,
  identity,
  datakey,
  fontSize,
  onCheckboxChange,
  onClick,
}: {
  text: string;
  icon?: React.ReactNode;
  iconBorder?: boolean;
  total?: string;
  checked: boolean;
  identity: string;
  datakey?: number;
  fontSize?: number;
  onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <aside className="w-full h-fit flex flex-row items-center gap-[0.5vw]">
      <input
        onChange={(e) => {
          onCheckboxChange(e);
        }}
        type="checkbox"
        checked={checked}
        name={text}
        id={text}
        data-identity={identity}
        data-datakey={datakey}
        className="hidden"
      />
      <label htmlFor={text} className="">
        <div
          className={`w-[1.5vw] h-[1.5vw] flex justify-center items-center border-[0.052083vw] border-[#C9EBE6] rounded-[0.54vw] ${
            checked && 'bg-[#C9EBE6]'
          }`}
        >
          {checked && <CheckedIcon />}
        </div>
      </label>
      <aside className="flex flex-row justify-center items-center gap-[0.130208vw]">
        {icon && (
          <article
            className={
              iconBorder
                ? 'w-[2vw] h-[2vw] flex justify-center items-center border-[0.078125vw] border-[#00A78B] rounded-full'
                : ''
            }
          >
            {icon}
          </article>
        )}
        <Paragraph fontSize={fontSize ? fontSize : 1.7} color="#00A78B">
          {text}
        </Paragraph>
        {total && (
          <Paragraph fontSize={fontSize ? fontSize : 1.7} color="#00A78B">{`(${total})`}</Paragraph>
        )}
      </aside>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        data-identity={identity}
        data-datakey={datakey}
        name={text}
        className="w-fit h-fit flex justify-center items-center"
      >
        <GreenCancelIcon width={1.3} />
      </motion.button>
    </aside>
  );
}
