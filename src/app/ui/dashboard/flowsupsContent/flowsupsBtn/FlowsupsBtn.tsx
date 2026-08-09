import { motion } from 'framer-motion';

export function FlowsupsBtn({
  text,
  left,
  top,
  onClick,
  textWrap,
}: {
  text: string;
  top: number;
  left: number;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  textWrap?: boolean;
}) {
  // ----- global states -----

  // ----- local status -----

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      type="button"
      className={`absolute border-[1.5vw] border-[#04825F42] shadow-lg drop-shadow-lg rounded-full flex justify-center items-center bg-[#7CC2B4] p-[2.5vw] text-[1.574074vh] text-nowrap font-semibold leading-[2.361111vh] text-white`}
      style={{
        width: '6.236458vw',
        height: '6.236458vw',
        left: `${left}vw`,
        top: `${top}vh`,
        flexDirection: textWrap ? 'column' : 'row',
      }}
    >
      {textWrap ? text.split(' ').map((word, index) => <span key={index + '-w-' + word}>{word}</span>) : text}
    </motion.button>
  );
}
