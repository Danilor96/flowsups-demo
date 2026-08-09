'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import AnimatedCounter from './AnimatedCounter';

interface NavbarItemProps {
  title: string;
  count: number;
  event: number;
  onOpen: (event: string) => void;
  openInNewTab: boolean;
}

export function NavbarItem({ title, count, event, onOpen, openInNewTab }: NavbarItemProps) {
  const controls = useAnimation();
  const [prevCount, setPrevCount] = useState(count);

  useEffect(() => {
    if (count !== prevCount) {
      // Pulse animation: scale up and down twice
      controls.start({
        scale: [1, 1.1, 1, 1.1, 1],
        borderColor: [
          "rgb(239 68 68 / 0)",
          "rgb(239 68 68 / 1)",
          "rgb(239 68 68 / 0)",
          "rgb(239 68 68 / 1)",
          "rgb(239 68 68 / 0)",
        ],
        transition: { duration: 3, ease: 'easeInOut', times: [0, 0.25, 0.5, 0.75, 1] },
      });
      setPrevCount(count);
    }
  }, [count, prevCount, controls]);

  return (
    <motion.button
      animate={controls}
      whileHover={{ scale: 1.05 }} // a smaller hover effect
      whileTap={{ scale: 0.95 }}
      data-event={event}
      onClick={(e) => {
        if (openInNewTab) {
          window.open(`/dashboard/${title.toLowerCase().replaceAll(' ', '')}`);
          return;
        }
        if (e.currentTarget.dataset.event) {
          onOpen(String(e.currentTarget.dataset.event));
        }
      }}
      className="flex px-[0.650521vw] gap-[0.5vw] justify-between max-w-[13vw] h-[6.185185vh] grid/ grid-cols-[auto_1fr_auto]/ items-center bg-[#FFFFFF] rounded-[2.083333vw] pl-[0.7vw]/ border-2 border-transparent"
    >
      <div className='ml-[0.650521vw]'>
        <p className="text-[#00A78B] text-center col-start-2/ ml-[0.792708vw]/ w-fit/ text-[1.87vh]">{title}</p>
      </div>
      <span className="px-[0.65vw] py-[0.25vw] col-start-3/ justify-self-end/ text-[1.981481vh] rounded-full bg-[#C9EBE6] text-[#00A78B] flex/ justify-center/ items-center/ ml-[0.650521vw]/ mr-[0.650521vw]/">
        <AnimatedCounter value={count || 0} />
      </span>
    </motion.button>
  );
}
