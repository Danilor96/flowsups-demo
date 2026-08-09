import { motion } from 'framer-motion';

export function DailyActivityPopUpWindow({
  height,
  information,
  width,
  backgroundColor,
  borderRadius,
  bottom,
  left,
  right,
  top,
  textColor,
  zIndex,
  value,
  onClick,
}: {
  width: number;
  height: number;
  borderRadius?: number;
  backgroundColor?: string;
  information: string;
  textColor?: string;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  zIndex?: number;
  value?: string | number;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <>
      <div
        className="absolute text-[1.8vh] font-normal px-[0.5vw] py-[0.5vh] shadow-crmFormShadow text-left flex flex-col gap-[2vh]"
        style={{
          width: `${width}vw`,
          height: `${height}vh`,
          top: `${top}vh`,
          right: `${right}vw`,
          bottom: `${bottom}vh`,
          left: `${left}vw`,
          backgroundColor: `${backgroundColor}`,
          borderRadius: `${borderRadius}vw`,
          color: `${textColor}`,
          zIndex: `${zIndex}`,
        }}
      >
        <p className="h-[70%] overflow-y-scroll">{information}</p>
        <motion.button
          onClick={onClick}
          data-accept="accept"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          value={value}
          className="w-[5vw] rounded-[0.2vw] text-[#FFF] h-[30%] bg-[#00A78B] mx-auto"
        >
          Accept
        </motion.button>
      </div>
    </>
  );
}
