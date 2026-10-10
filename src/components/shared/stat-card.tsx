'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

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
    // Respect prefers-reduced-motion
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
          const duration = 1500; // 1.5s
          
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // easeOutQuart
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
      className="flex flex-col p-8 bg-white rounded-[14px] border border-[#E2E8F0] shadow-sm items-center text-center hover:shadow-md transition-shadow duration-300"
    >
      <div className="text-4xl md:text-5xl font-bold text-[#0056D2] mb-3 tracking-tight">
        {prefix}{count}{suffix}
      </div>
      <h3 className="text-lg font-bold text-[#0F172A] mb-2 uppercase tracking-wide">
        {label}
      </h3>
      {description && (
        <p className="text-[15px] text-[#475569] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
