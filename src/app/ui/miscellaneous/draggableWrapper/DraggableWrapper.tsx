import { motion } from 'framer-motion';
import React from 'react';

interface DraggableWrapperProps {
  children: React.ReactNode;
}

export function DraggableWrapper({ children }: DraggableWrapperProps) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{ cursor: 'grab' }}
      whileDrag={{ cursor: 'grabbing' }}
    >
      {children}
    </motion.div>
  );
}
