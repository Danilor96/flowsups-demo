import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { motion } from 'framer-motion';

export function EnterAdvice() {
  // ----- global states -----

  // ----- local states -----

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute top-[5.2vh] left-[-0.28vw] z-10 w-max"
    >
      <Paragraph color="#00A78B">Press enter to search the customer</Paragraph>
    </motion.div>
  );
}
