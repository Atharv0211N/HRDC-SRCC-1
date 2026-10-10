import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  label,
  title,
  description,
  ctaText,
  ctaHref,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col mb-12',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {label && (
        <span className="text-sm font-semibold tracking-wider text-[#0056D2] uppercase mb-3 block">
          {label}
        </span>
      )}
      
      <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight mb-4">
        {title}
      </h2>
      
      {description && (
        <p
          className={cn(
            'text-base md:text-lg text-[#475569] leading-relaxed max-w-2xl',
            align === 'center' ? 'mx-auto' : ''
          )}
        >
          {description}
        </p>
      )}

      {ctaText && ctaHref && (
        <Link
          href={ctaHref}
          className="inline-flex items-center mt-6 text-[15px] font-medium text-[#0056D2] hover:text-blue-800 transition-colors group"
        >
          {ctaText}
          <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
}
