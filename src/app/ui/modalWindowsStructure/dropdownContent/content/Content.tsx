import { Loader } from '@/app/ui/miscellaneous/loader/Loader';
import { motion } from 'framer-motion';

export function Content({
  children,
  height,
  itemsCenter,
  overflowVisible,
  overflowScroll,
  loading,
}: {
  children: React.ReactNode;
  height?: number;
  itemsCenter?: boolean;
  overflowVisible?: boolean;
  overflowScroll?: boolean;
  loading?: boolean;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <motion.article
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full border-b-[0.15625vw] border-l-[0.15625vw] border-r-[0.15625vw] border-[#C9EBE6] rounded-b-[1.041667vw] px-[2.083333vw] py-[1vh] max-lg:px-3"
      style={{
        minHeight: height ? `${height}vh` : '100%',
        display: itemsCenter ? 'flex' : 'block',
        alignItems: 'center',
        overflowY: overflowVisible ? 'visible' : overflowScroll ? 'scroll' : 'hidden',
      }}
    >
      {children}
      {loading && <Loader />}
    </motion.article>
  );
}
