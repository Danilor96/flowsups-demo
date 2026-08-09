import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { motion } from 'framer-motion';

export function InfoDisplay({ info }: { info: string }) {
  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute top-[3vh] z-10 w-fit h-fit flex flex-col justify-center items-center"
    >
      <div className="w-[0] h-[0] border-l-[0.5vw] border-l-[#00000000] border-r-[0.5vw] border-r-[#00000000] border-b-[0.5vw] border-b-[#C9EBE6]"></div>
      <div className="w-max h-fit bg-[#C9EBE6] px-[0.3vw] py-[0.5vh]">
        <Paragraph fontSize={1.8} fontWeight={500} color="#00A78B">
          {info}
        </Paragraph>
      </div>
    </motion.article>
  );
}
