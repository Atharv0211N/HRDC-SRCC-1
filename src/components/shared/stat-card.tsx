'use client';

import { useEffect, useRef, useState } from 'react';

interface StatCardProps {
  value: string;
  label: string;
  description?: string;
}

export function StatCard({ value, label, description }: StatCardProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Parse numeric value and suffix/prefix
  const numericMatch = value.match(/\d+/);
  const targetNumber = numericMatch ? parseInt(numericMatch[0], 10) : 0;
  const prefix = value.substring(0, value.indexOf(targetNumber.toString()));
  const suffix = value.substring(value.indexOf(targetNumber.toString()) + targetNumber.toString().length);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setCount(targetNumber);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          let startTimestamp: number | null = null;
          const duration = 1600;
          
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            
            setCount(Math.floor(easeProgress * targetNumber));
            
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(targetNumber);
              setHasAnimated(true);
            }
          };
          
          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [targetNumber, hasAnimated]);

  return (
    <div 
      ref={elementRef}
      className="relative flex flex-col p-8 bg-white rounded-[16px] border border-[#E2E8F0] card-hover-lift items-center text-center overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
      
      <div className="text-4xl md:text-5xl font-extrabold text-[#0056D2] mb-3 tracking-tight">
        {prefix}{count}{suffix}
      </div>
      <h3 className="text-sm font-bold text-[#0F172A] mb-2 uppercase tracking-wider">
        {label}
      </h3>
      {description && (
        <p className="text-[14px] text-[#475569] leading-relaxed max-w-xs">
          {description}
        </p>
      )}
    </div>
  );
}
