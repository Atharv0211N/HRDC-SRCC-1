'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  title: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
  compact?: boolean;
}

export function Hero({
  title,
  description,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  imageSrc,
  imageAlt = 'HRDC SRCC',
  compact = false,
}: HeroProps) {
  if (compact) {
    return (
      <section className="bg-[#F8FAFC] py-16 md:py-24 border-b border-[#E2E8F0]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-[#0F172A] leading-[1.15] tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="text-lg md:text-xl text-[#475569] leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white pt-24 pb-16 md:pt-32 md:pb-24 border-b border-[#E2E8F0]/60">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' as const }}
              className="inline-block"
            >
              <span className="text-xs md:text-sm font-semibold tracking-wider text-[#0056D2] uppercase">
                Human Resource Development Cell • SRCC
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' as const }}
              className="text-4xl sm:text-5xl lg:text-[60px] font-bold text-[#0F172A] leading-[1.12] tracking-tight"
            >
              {title}
            </motion.h1>
            
            {description && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' as const }}
                className="text-lg md:text-xl text-[#475569] leading-relaxed max-w-xl"
              >
                {description}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' as const }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
            >
              {ctaText && ctaHref && (
                <Link
                  href={ctaHref}
                  className="inline-flex items-center justify-center bg-[#0056D2] hover:bg-[#004AB8] text-white px-8 py-3.5 rounded-[12px] text-[15px] font-medium transition-colors shadow-xs group w-full sm:w-auto"
                >
                  {ctaText}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              )}
              
              {secondaryCtaText && secondaryCtaHref && (
                <Link
                  href={secondaryCtaHref}
                  className="inline-flex items-center justify-center bg-white text-[#0F172A] border border-[#CBD5E1] hover:border-[#0F172A] px-8 py-3.5 rounded-[12px] text-[15px] font-medium transition-colors w-full sm:w-auto"
                >
                  {secondaryCtaText}
                </Link>
              )}
            </motion.div>
          </div>

          {/* Right Column: Clean Institutional Visual */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' as const }}
              className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden bg-gradient-to-tr from-slate-100 to-slate-50 border border-[#E2E8F0] shadow-sm"
            >
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 550px"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50">
                  <span className="text-3xl font-bold text-[#0056D2] tracking-tight mb-2">HRDC SRCC</span>
                  <span className="text-sm text-[#64748B] uppercase tracking-widest font-medium">Enable • Edify • Empower</span>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
