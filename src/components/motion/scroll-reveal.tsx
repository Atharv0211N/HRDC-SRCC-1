'use client';

import React from 'react';
import { motion } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) {
  const getVariants = () => {
    switch (direction) {
      case 'up':
        return { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
      case 'down':
        return { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } };
      case 'left':
        return { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } };
      case 'right':
        return { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } };
      case 'none':
        return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
      default:
        return { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: 0.5, 
        delay, 
        ease: 'easeOut' as const
      }}
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
}
