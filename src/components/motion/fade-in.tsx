'use client';

import React from 'react';
import { motion } from 'motion/react';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration, 
        delay,
        ease: 'easeOut' as const
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
