import { motion } from 'framer-motion';
import { useState } from 'react';

export function CancelAppointmentInput({
  onDecision,
  fieldError,
}: {
  onDecision: (decision: boolean, input: string | null) => void;
  fieldError?: string;
}) {
  const [input, setInput] = useState<string | null>('');

  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { yes, no } = e.currentTarget.dataset;

    yes && onDecision(true, input);

    no && onDecision(false, input);
  };

  return (
    <motion.section
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-[7vh] left-[5.5vw] z-[2] w-[30vw] h-fit bg-[#FFF] rounded-[0.58vw] px-[1vw] py-[1vh] flex flex-col justify-center items-center gap-[2.5vh]"
    >
      <h2 className="w-fit text-[2vh] font-medium text-[#00A28A] ">
        Please, enter the reason for cancellation. The answer will be sent to the managers in order
        to be confirmed by them. Until the managers confirm this action, the current status of the
        appointment will remain but the interactions will be disabled.
      </h2>
      <textarea
        name=""
        id=""
        onChange={(e) => setInput(e.currentTarget.value)}
        autoComplete="off"
        className="w-full h-[11vh] rounded-[0.520833vw] bg-[#F4F4F4] outline-[#92CEC3] px-[0.6vw] text-[1.9vh] font-medium text-[#959595] resize-none"
      />
      <p className="text-[1.8vh] text-red-500">{fieldError && fieldError}</p>
      <div className="w-full flex flex-row justify-center gap-[3vw] ">
        <motion.button
          onClick={handleConfirm}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          data-no={true}
          className="w-[30%] px-[1vw] py-[1vh] border-[0.15vw] border-gray-500 rounded-[0.6vw] hover:bg-gray-300 transition-colors"
        >
          Cancel
        </motion.button>
        <motion.button
          onClick={handleConfirm}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          data-yes={true}
          className="w-[30%] text-red-600 px-[1vw] py-[1vh] border-[0.15vw] border-red-600 rounded-[0.6vw] hover:bg-red-300 transition-colors"
        >
          Confirm
        </motion.button>
      </div>
    </motion.section>
  );
}
