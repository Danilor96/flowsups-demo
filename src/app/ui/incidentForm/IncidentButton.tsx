'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ExclamationIcon } from '&/icons/Icons';
import { IncidentForm } from './IncidentForm';
import { useState } from 'react';

export function IncidentButton() {
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleHideForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowForm(false);
  };

  return (
    <motion.div
      drag
      dragConstraints={{
        left: 0,
        right: window.innerWidth - 50,
        top: 0,
        bottom: window.innerHeight - 150,
      }}
      whileHover={{ scale: 1.1 }}
      className="absolute w-fit h-fit bg-white rounded-full cursor-pointer shadow-crmFormShadow"
      style={{
        zIndex: '400',
      }}
      onDoubleClick={() => setShowForm(true)}
    >
      <ExclamationIcon />
      <AnimatePresence>{showForm && <IncidentForm onClick={handleHideForm} />}</AnimatePresence>
    </motion.div>
  );
}
