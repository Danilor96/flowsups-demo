import { motion } from 'framer-motion';

export function FieldErrorMessage({ message }: { message: string }) {
  // ----- global states -----

  // ----- local states -----

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute top-[5vh] left-0 w-fit text-[2vh] text-red-500"
    >
      {message}
    </motion.p>
  );
}
