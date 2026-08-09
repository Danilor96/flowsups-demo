import { FilterIconBtn } from '&/icons/Icons';
import { motion } from 'framer-motion';

export function FilterButton({
  onClick,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="w-[2.864583vw] h-[2.864583vw] flex justify-center items-center bg-[#67BFAF] shadow-crmFormShadow rounded-full"
    >
      <FilterIconBtn />
    </motion.button>
  );
}
