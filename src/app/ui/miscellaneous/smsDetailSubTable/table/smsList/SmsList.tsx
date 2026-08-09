import { motion } from 'framer-motion';
import { useState } from 'react';
import { SmsContainer } from './smsContainer/SmsContainer';
import { SmsData } from '@/app/api/reports/storeReport/callActivity/smsDetail/types';

export function SmsList({
  lastSmsText,
  customerName,
  smsData,
}: {
  lastSmsText: string;
  customerName?: string;
  smsData: SmsData[];
}) {
  // ----- global states -----

  // ----- local states -----

  const [open, setOpen] = useState(false);

  const textPrinting = () => {
    const textLessOrEqualThanLimit = lastSmsText.length <= 30;

    if (textLessOrEqualThanLimit) return textLessOrEqualThanLimit;

    return `${lastSmsText.slice(0, 30)}...`;
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <motion.button
        onClick={handleOpen}
        type="button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-fit flex justify-center items-center bg-secondaryColor px-[0.2vw] rounded-[0.5vw]"
      >
        <p className="text-[2vh] text-primaryColor">{textPrinting()}</p>
      </motion.button>
      {open && <SmsContainer onClose={handleOpen} customerName={customerName} smsData={smsData} />}
    </>
  );
}
