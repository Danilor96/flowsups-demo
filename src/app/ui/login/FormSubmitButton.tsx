'use client';

import { motion } from 'framer-motion';
import { useFormStatus } from 'react-dom';

export function FormSubmitButton({ buttonText }: { buttonText: string }) {
  const { pending } = useFormStatus();

  return (
    <motion.button
      whileHover={{ scale: !pending ? 1.1 : 1 }}
      whileTap={{ scale: !pending ? 0.9 : 1 }}
      className="w-full lg:w-[24.579167vw] h-[5.462037vh] bg-mainColor rounded-[0.653646vw] py-[1.526852vh] px-[9.919792vw] text-[1.626852vh] font-semibold leading-[2.440741vh] text-[#FFFFFF] disabled:bg-[#00a78b70]"
      disabled={pending}
    >
      {pending ? 'Loading' : buttonText}
    </motion.button>
  );
}
