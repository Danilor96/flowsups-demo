import { ClipIcon, SendMessageIcon } from '&/icons/Icons';
import { motion } from 'framer-motion';

export function InputButtons({
  disabled,
  sendSms,
  fileInputRef,
  widthFull,
}: {
  disabled: boolean;
  sendSms: (event: React.MouseEvent<HTMLButtonElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  widthFull?: boolean;
}) {
  // ----- global states -----

  // ----- loca states -----

  return (
    <article
      className="w-[10%] flex flex-row items-center h-full"
      style={{
        width: widthFull ? '100%' : '11%',
        justifyContent: widthFull ? 'space-between' : 'space-around',
      }}
    >
      <motion.button
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.2 }}
        whileTap={{ scale: disabled ? 1 : 0.9 }}
        onClick={() => {
          fileInputRef.current?.click();
        }}
        style={{
          width: widthFull ? '3vw' : '2.2vw',
          height: widthFull ? '3vw' : '2.2vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        className={`${widthFull && 'shadow-crmFormShadow rounded-md border border-[#00a78b]'}`}
      >
        <ClipIcon />
      </motion.button>
      <motion.button
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.2 }}
        whileTap={{ scale: disabled ? 1 : 0.9 }}
        onClick={sendSms}
        style={{
          width: widthFull ? '3vw' : '2.2vw',
          height: widthFull ? '3vw' : '2.2vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        className={`${widthFull && 'shadow-crmFormShadow rounded-md border border-[#00a78b]'}`}
      >
        <SendMessageIcon />
      </motion.button>
    </article>
  );
}
