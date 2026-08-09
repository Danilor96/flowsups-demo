import { publicCreditAppPageStore } from '@/store/creditApp';
import { motion } from 'framer-motion';

export function ProgressBar() {
  // ----- global states -----

  const { currentProgress } = publicCreditAppPageStore();

  // ----- local states -----

  return (
    <div className="w-full h-[0.25rem] bg-primaryColor rounded-lg">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${currentProgress}%` }}
        className="flex justify-center items-start bg-primaryColor h-full"
      >
        {/* <p className="pt-[0.2rem] text-[2vh] text-white">{`${currentProgress
          .toFixed(2)
          .replace('.00', '')}%`}</p> */}
      </motion.div>
    </div>
  );
}
