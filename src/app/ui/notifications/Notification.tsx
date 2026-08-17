import { motion } from 'framer-motion';
import { FailIcon, SuccessIcon } from '&/icons/Icons';
import { Loader } from '../miscellaneous/loader/Loader';

export function SuccessNotification({
  apiMessage,
  height,
  width,
  gap,
}: {
  apiMessage: string;
  width?: number;
  height?: number;
  gap?: number;
}) {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-[6vh] left-0 right-0 z-50 w-fit mx-auto text-center"
    >
      <p
        className="mx-auto flex flex-row justify-center items-center bg-[#FFF] shadow-crmFormShadow rounded-[0.520833vw] !max-lg:w-[min(90vw,24rem)]"
        style={{
          width: `${width ? `${width}vw` : '31.197917vw'}`,
          height: `${height ? `${height}vh` : '11.296296vh'}`,
          gap: `${gap ? `${gap}vw` : '0.640625vw'}`,
        }}
      >
        <span>
          <SuccessIcon />
        </span>
        <span className="w-[75%] text-[2vh] font-medium leading-[1.805556vh] text-[#00A78B] max-lg:text-sm max-lg:leading-normal">
          {apiMessage}
        </span>
      </p>
    </motion.div>
  );
}

export function FailNotification({
  apiMessage,
  gap,
  height,
  width,
}: {
  apiMessage: string;
  width?: number;
  height?: number;
  gap?: number;
}) {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-[6vh] left-0 right-0 mx-auto z-50 w-fit text-center"
    >
      <p
        className="mx-auto flex flex-row justify-center items-center bg-[#FFF] shadow-crmFormShadow rounded-[0.520833vw] p-[0.5vw] !max-lg:w-[min(90vw,24rem)]"
        style={{
          width: `${width ? `${width}vw` : '31.197917vw'}`,
          height: `${height ? `${height}vh` : '11.296296vh'}`,
          gap: `${gap ? `${gap}vw` : '0.640625vw'}`,
        }}
      >
        <span>
          <FailIcon />
        </span>
        <span className="w-fit text-[2vh] font-medium leading-[1.805556vh] text-[#ED0000] max-lg:text-sm max-lg:leading-normal">
          {apiMessage}
        </span>
      </p>
    </motion.div>
  );
}

export function ConfirmNotification({
  notiMessage,
  alterNotiMessage,
  alterNotiMessageColor,
  loading,
  textWidth,
  onDecision,
  children,
  childrenBottom,
  noAlterText,
  yesAlterText,
  overflowVisible,
  nullMssgDontRemovesNoti,
}: {
  notiMessage: string;
  alterNotiMessage?: string;
  alterNotiMessageColor?: string;
  loading?: boolean;
  textWidth?: number;
  children?: React.ReactNode;
  childrenBottom?: boolean;
  yesAlterText?: string;
  noAlterText?: string;
  overflowVisible?: boolean;
  nullMssgDontRemovesNoti?: boolean;
  onDecision: (decision: boolean) => void;
}) {
  const handleDecision = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { yes, no } = e.currentTarget.dataset;

    if (yes) {
      onDecision(true);
    }

    if (no) {
      onDecision(false);
    }
  };

  if (!notiMessage && !nullMssgDontRemovesNoti) return null;

  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-[0vh] left-0 right-0 z-50 w-full h-full flex justify-center items-center confirmNoti"
    >
      <article
        className="relative w-fit flex flex-col gap-[2vh] rounded-[1.3vw] bg-white p-[1vw] text-[2.222222vh] text-gray-600 border-[0.15vw] border-[#00A78B] max-lg:w-[min(90vw,26rem)] max-lg:p-4 max-lg:rounded-xl"
        style={{
          overflow: overflowVisible ? 'visible' : 'hidden',
        }}
      >
        <p
          className="text-wrap max-lg:text-sm max-lg:leading-normal"
          style={{
            width: textWidth ? `${textWidth}vh` : '',
          }}
        >
          {notiMessage}
          <span
            style={{
              color: alterNotiMessageColor,
            }}
          >
            {alterNotiMessage}
          </span>
        </p>
        {!childrenBottom && children}
        <aside className="w-full flex flex-row justify-center gap-[1vw] confirmNotiBtnsContainer max-lg:gap-2">
          <motion.button
            onClick={handleDecision}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            data-no={true}
            className="w-[8vw] px-[1vw] py-[1vh] border-[0.15vw] border-gray-500 rounded-[0.6vw] hover:bg-gray-500 hover:text-white transition-colors confirmNotiBtn max-lg:w-24 max-lg:min-h-9 !max-lg:text-sm"
          >
            {noAlterText ? noAlterText : 'No'}
          </motion.button>
          <motion.button
            onClick={handleDecision}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            data-yes={true}
            className="w-[8vw] text-red-600 px-[1vw] py-[1vh] border-[0.15vw] border-red-600 rounded-[0.6vw] hover:bg-red-600 hover:text-white transition-colors confirmNotiBtn max-lg:w-24 max-lg:min-h-9 !max-lg:text-sm"
          >
            {yesAlterText ? yesAlterText : 'Yes'}
          </motion.button>
        </aside>
        {childrenBottom && children}
        {loading && <Loader />}
      </article>
    </motion.div>
  );
}
