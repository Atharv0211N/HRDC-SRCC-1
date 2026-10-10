import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

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
  imageAlt = 'Hero image',
  compact = false,
}: HeroProps) {
  if (compact) {
    return (
      <section className="bg-[#F8FAFC] py-16 md:py-24 border-b border-[#E2E8F0]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-[64px] font-bold text-[#0F172A] leading-[1.1] tracking-tight">
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
    <section className="bg-white pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="space-y-8">
            <h1 className="text-[48px] md:text-[56px] lg:text-[64px] font-bold text-[#0F172A] leading-[1.1] tracking-tight">
              {title}
            </h1>
            
            {description && (
              <p className="text-lg md:text-xl text-[#475569] leading-relaxed max-w-lg">
                {description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
              {ctaText && ctaHref && (
                <Link
                  href={ctaHref}
                  className="inline-flex items-center justify-center bg-[#0056D2] text-white px-8 py-3.5 rounded-[14px] text-[16px] font-medium hover:bg-blue-700 transition-colors shadow-sm group w-full sm:w-auto"
                >
                  {ctaText}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              
              {secondaryCtaText && secondaryCtaHref && (
                <Link
                  href={secondaryCtaHref}
                  className="inline-flex items-center justify-center bg-white text-[#0F172A] border border-[#E2E8F0] px-8 py-3.5 rounded-[14px] text-[16px] font-medium hover:bg-[#F8FAFC] hover:text-[#0056D2] hover:border-[#0056D2]/30 transition-colors w-full sm:w-auto"
                >
                  {secondaryCtaText}
                </Link>
              )}
            </div>
          </div>

          {imageSrc && (
            <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square rounded-[18px] overflow-hidden bg-[#F8FAFC]">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
