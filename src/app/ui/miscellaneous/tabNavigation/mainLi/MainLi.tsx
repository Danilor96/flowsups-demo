import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export function MainLi({
  description,
  descriptionLeft,
  directionIn,
  directionOut,
  ind,
  index,
  noRoundedTop,
  manualNavNumber,
  onClick,
}: {
  index: number;
  ind: number;
  directionIn: string;
  directionOut: string;
  description: string;
  descriptionLeft: boolean;
  noRoundedTop: boolean;
  manualNavNumber?: number;
  onClick: () => void;
}) {
  // ----- global states -----

  // ----- local states -----

  const [showDescription, setShowDescription] = useState<number | null>(null);

  return (
    <motion.li
      onMouseEnter={() => setShowDescription(ind)}
      onMouseLeave={() => setShowDescription(null)}
      onClick={onClick}
      initial={{
        background: 'linear-gradient(to right, #c9ebe6 0%, transparent 0%)',
      }}
      animate={{
        background:
          index === ind
            ? `linear-gradient(to ${directionIn}, #c9ebe6 100%, transparent 100%)`
            : `linear-gradient(to ${directionOut}, #c9ebe6 0%, transparent 0%)`,
      }}
      exit={{ background: 'linear-gradient(to right, transparent 100%, #c9ebe6 100%)' }}
      key={`navikey---${ind + 48}`}
      className={`relative cursor-pointer px-[1vw] text-[2vh] font-semibold text-primaryColor border-b-2 transition-colors ${
        index === ind ? 'border-b-primaryColor' : 'border-white hover:border-primaryColor'
      } ${noRoundedTop ? '' : 'rounded-t-md'}`}
    >
      {manualNavNumber ? manualNavNumber : ind + 1}
      <AnimatePresence>
        {showDescription === ind && (
          <motion.p
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute min-w-fit text-nowrap px-[0.2vw] py-[0.1vh] rounded-md bg-secondaryColor text-primaryColor text-[2vh] font-semibold cursor-default ${
              descriptionLeft
                ? 'right-[3vw] bottom-0'
                : 'right-[50%] translate-x-[50%] bottom-[4vh]'
            }`}
          >
            {description || ''}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
