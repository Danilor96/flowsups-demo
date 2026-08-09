import { ThreeHorizontalDots } from '&/icons/Icons';
import { motion } from 'framer-motion';

export function Button({
  onClick,
}: {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="w-[2.03125vw] h-[2.03125vw] flex justify-center items-center mx-auto rounded-[0.6vw] bg-[#FFFFFF40] shadow-crmFormShadow"
    >
      <ThreeHorizontalDots />
    </motion.button>
  );
}
