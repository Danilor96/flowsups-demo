import { motion } from 'framer-motion';

export function OptionButton({
  option,
  top,
  left,
  onClick,
}: {
  option: string;
  top: number;
  left: number;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="absolute w-[6.038021vw] h-[6.038021vw] rounded-full border-[0.4vw] border-[#FFFFFF] bg-[#C9EBE6] text-[1.851852vh] font-semibold leading-[1.805556vh] text-[#00A78B] shadow-crmFormShadow"
      style={{
        top: `${top}vh`,
        left: `${left}vw`,
      }}
    >
      {option}
    </motion.button>
  );
}
