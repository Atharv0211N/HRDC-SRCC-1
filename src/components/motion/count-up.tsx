'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'motion/react';

interface CountUpProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

export function CountUp({ target, suffix = '', prefix = '', duration = 1.5 }: CountUpProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    setIsReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      if (isReducedMotion) {
        count.set(target);
      } else {
        animate(count, target, { duration, ease: "easeOut" });
      }
      setHasAnimated(true);
    }
  }, [isInView, target, duration, count, isReducedMotion, hasAnimated]);

  return (
    <span ref={ref}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
