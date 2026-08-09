import { CancelIcon } from '&/icons/Icons';
import { Loader } from '&/miscellaneous/loader/Loader';
import { messagesStore } from '@/store/adminDashboard';
import { useTwilioStore } from '@/store/phoneDevice';
import { motion } from 'framer-motion';
import { useState } from 'react';

export function TransferBtn({
  conferenceSid,
  conferenceName,
  bdcNumber,
  salesNumber,
  toggleOpen,
}: {
  conferenceSid: string;
  conferenceName: string;
  salesNumber?: string | null;
  bdcNumber?: string | null;
  toggleOpen: () => void;
}) {
  // ----- global states -----

  const { transferNoAnsweredConference } = useTwilioStore();

  const { setMessages } = messagesStore();

  // ----- local states -----

  const [cancelColor, setCancelColor] = useState('');

  const [loading, setLoading] = useState(false);

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;

    setLoading(true);

    try {
      if (value === 'sales') {
        if (salesNumber !== null) {
          await transferNoAnsweredConference(conferenceName, conferenceSid, salesNumber);
        }
      }

      if (value === 'bdc') {
        if (bdcNumber !== null) {
          await transferNoAnsweredConference(conferenceName, conferenceSid, undefined, bdcNumber);
        }
      }
    } catch (error) {
      setMessages('An error occurred');
    }

    setLoading(false);
  };

  return (
    <article className="absolute top-0 left-0 w-full h-full flex flex-row items-center bg-white">
      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: '#00a78b', color: '#FFF' }}
        whileTap={{ scale: 0.9 }}
        onClick={handleButton}
        value="sales"
        className="w-[37.33%] h-[80%] flex justify-center items-center border-[0.015vw] font-semibold text-primaryColor border-primaryColor bg-white"
      >
        <p>Sales Rep</p>
      </motion.button>
      <motion.button
        whileHover={{
          scale: bdcNumber ? 1.1 : 1,
          backgroundColor: bdcNumber ? '#00a78b' : '',
          color: bdcNumber ? '#FFF' : '',
        }}
        whileTap={{ scale: bdcNumber ? 0.9 : 1 }}
        onClick={handleButton}
        value="bdc"
        className="w-[37.33%] h-[80%] flex justify-center items-center border-[0.015vw] font-semibold text-primaryColor border-primaryColor bg-white"
        disabled={bdcNumber ? false : true}
      >
        <p>{bdcNumber ? 'BDC' : 'No BDC'}</p>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: '#ef4444' }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleOpen}
        onHoverStart={() => setCancelColor('#FFF')}
        onHoverEnd={() => setCancelColor('')}
        className="w-[25.33%] h-[80%] flex justify-center items-center border-[0.015vw] text-primaryColor border-red-500"
      >
        <CancelIcon color={cancelColor ? cancelColor : ''} />
      </motion.button>
      {loading && <Loader />}
    </article>
  );
}
