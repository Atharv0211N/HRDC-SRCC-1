'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Award, ShieldCheck } from 'lucide-react';
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
  compact = false,
}: HeroProps) {
  if (compact) {
    return (
      <section className="relative bg-[#F8FAFC] py-16 md:py-24 border-b border-[#E2E8F0] overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="relative container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
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
    <section className="relative bg-gradient-to-b from-[#F8FAFC] via-white to-white pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* Background Decorative Mesh & Radial Glows */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-100/60 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Trust Pill / Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' as const }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/60 text-[#0056D2] text-xs md:text-sm font-semibold shadow-xs"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0056D2]"></span>
              </span>
              <span>Shri Ram College of Commerce • Est. 2008</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' as const }}
              className="text-[42px] sm:text-[52px] lg:text-[62px] font-extrabold text-[#0F172A] leading-[1.08] tracking-tight"
            >
              Enable. Edify. <br className="hidden sm:inline" />
              <span className="gradient-text-primary">Empower Leaders.</span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' as const }}
              className="text-lg md:text-xl text-[#475569] leading-relaxed max-w-xl"
            >
              {description || 'The premier student-led human resource development organization at Shri Ram College of Commerce, University of Delhi.'}
            </motion.p>

            {/* Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' as const }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              {ctaText && ctaHref && (
                <Link
                  href={ctaHref}
                  className="inline-flex items-center justify-center bg-[#0056D2] hover:bg-[#0045A8] text-white px-7 py-3.5 rounded-[12px] text-[15px] font-semibold transition-all shadow-md shadow-blue-500/15 hover:shadow-lg hover:shadow-blue-500/25 group"
                >
                  {ctaText}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              
              {secondaryCtaText && secondaryCtaHref && (
                <Link
                  href={secondaryCtaHref}
                  className="inline-flex items-center justify-center bg-white hover:bg-slate-50 text-[#0F172A] border border-[#CBD5E1] px-7 py-3.5 rounded-[12px] text-[15px] font-semibold transition-all hover:border-[#0056D2]/40 shadow-xs"
                >
                  {secondaryCtaText}
                </Link>
              )}
            </motion.div>

            {/* Micro Institutional Trust Marks */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-6 flex flex-wrap items-center gap-6 text-xs text-[#64748B] border-t border-slate-200/60"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0056D2]" />
                <span>Premier SRCC Institution</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#0056D2]" />
                <span>16+ Years of Student Legacy</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0056D2]" />
                <span>Research & Consulting Excellence</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' as const }}
              className="relative mx-auto max-w-[420px] lg:max-w-none"
            >
              {/* Main Visual Card */}
              <div className="relative rounded-[22px] bg-gradient-to-br from-white via-slate-50 to-blue-50/50 p-6 md:p-8 border border-slate-200/80 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
                    <div>
                      <p className="text-xs uppercase font-bold tracking-wider text-[#0056D2]">Identity & Purpose</p>
                      <h3 className="text-xl font-bold text-[#0F172A] mt-0.5">HRDC SRCC</h3>
                    </div>
                    <span className="px-3 py-1 bg-blue-100/70 text-[#0056D2] text-xs font-bold rounded-full">
                      Motto
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-[14px] bg-white border border-slate-200/60 shadow-xs flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#0F172A]">Enable</span>
                      <span className="text-xs text-[#64748B]">Capacity Building</span>
                    </div>
                    <div className="p-4 rounded-[14px] bg-white border border-slate-200/60 shadow-xs flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#0F172A]">Edify</span>
                      <span className="text-xs text-[#64748B]">Intellectual Research</span>
                    </div>
                    <div className="p-4 rounded-[14px] bg-white border border-slate-200/60 shadow-xs flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#0F172A]">Empower</span>
                      <span className="text-xs text-[#64748B]">Leadership in Action</span>
                    </div>
                  </div>

                  {/* Highlights Summary */}
                  <div className="pt-2 grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-[12px] bg-blue-50/60 border border-blue-100 text-center">
                      <div className="text-2xl font-bold text-[#0056D2]">16+</div>
                      <div className="text-xs text-[#475569] font-medium mt-0.5">Years Active</div>
                    </div>
                    <div className="p-3.5 rounded-[12px] bg-indigo-50/60 border border-indigo-100 text-center">
                      <div className="text-2xl font-bold text-indigo-700">100%</div>
                      <div className="text-xs text-[#475569] font-medium mt-0.5">Student Led</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Pill 1: Top Right */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="hidden sm:flex absolute -top-5 -right-5 items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg text-xs font-semibold text-[#0F172A]"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Active 2024-25 Cabinet</span>
              </motion.div>

              {/* Floating Pill 2: Bottom Left */}
              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="hidden sm:flex absolute -bottom-5 -left-5 items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg text-xs font-semibold text-[#0F172A]"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Flagship: Minductor</span>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
