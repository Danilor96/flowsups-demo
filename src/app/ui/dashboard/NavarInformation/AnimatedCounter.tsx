'use client';

import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

function AnimatedCounter({ value }: { value: number }) {
  // To prevent showing NaN if value is not a number initially
  const numericValue = Number(value) || 0;

  const count = useSpring(numericValue, { mass: 0.8, stiffness: 100, damping: 15 });
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const display = useTransform(rounded, (latest) => {
    if (latest > 99) {
      return '+99';
    }
    return latest.toString();
  });

  useEffect(() => {
    count.set(numericValue);
  }, [count, numericValue]);

  return <motion.span>{display}</motion.span>;
}

export default AnimatedCounter;
