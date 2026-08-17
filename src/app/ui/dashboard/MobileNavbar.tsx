'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavbarInformation } from '&/dashboard/NavbarInformation';
import { Notifications } from './notifications/Notifications';
import { UserInfo } from './UserInfo';

export function MobileNavbar({
  name,
  lastname,
  roleId,
}: {
  name: string;
  lastname: string;
  roleId: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="below-lg-only relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex flex-col justify-center items-center gap-[0.3rem] w-11 h-11 rounded-lg"
        aria-label="Open menu"
      >
        <span className="block w-6 h-[0.2rem] bg-mainColor rounded" />
        <span className="block w-6 h-[0.2rem] bg-mainColor rounded" />
        <span className="block w-6 h-[0.2rem] bg-mainColor rounded" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 z-[300]"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-[310] w-[85vw] max-w-sm bg-white shadow-2xl flex flex-col gap-4 p-4 overflow-y-auto"
            >
              <div className="flex justify-end items-center gap-2">
                <div className="mr-auto">
                  <UserInfo name={name} lastname={lastname} />
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-3xl leading-none text-formColor"
                  aria-label="Close menu"
                >
                  &times;
                </button>
              </div>
              <div className="w-full flex flex-row items-center justify-center gap-2">
                <Notifications />
              </div>
              <div className="w-full bg-[#C9EBE6] rounded-2xl px-2 py-3 flex flex-col gap-2">
                <NavbarInformation roleId={roleId} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}