'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const SESSION_KEY = 'flowsups_demo_notice_seen';

export function DemoNoticeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(SESSION_KEY)) {
        setOpen(true);
      }
    } catch (e) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(SESSION_KEY, 'true');
    } catch (e) {}
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[6000] flex items-center justify-center bg-[#0000008A] px-4"
          onClick={handleClose}
        >
          <motion.article
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-[0.75rem] shadow-crmFormShadow p-6 max-lg:p-5"
          >
            <h2 className="text-xl font-semibold text-[#009075] mb-3">Demo project</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              This application is a <strong>demo</strong>. Most functions and functionalities are
              simulated or simplified, and they are not the final product.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              The performance you see here is for demonstration purposes only and may not reflect
              the real behavior of the production system.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              Also, this project was designed only for large screens (&#8805;1024px).
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 rounded-[0.5rem] bg-[#009075] text-white text-sm font-semibold hover:bg-[#007a66]"
              >
                Got it
              </button>
            </div>
          </motion.article>
        </motion.section>
      )}
    </AnimatePresence>
  );
}