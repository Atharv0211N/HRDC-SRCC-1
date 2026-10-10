import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Partner {
  name: string;
  logo: string;
  website?: string | null;
}

interface PartnerGridProps {
  partners: Partner[];
}

export function PartnerGrid({ partners }: PartnerGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 items-center justify-center">
      {partners.map((partner, index) => {
        const logoContent = (
          <div className="relative w-full aspect-[3/2] flex items-center justify-center p-4 bg-white rounded-[10px] border border-[#E2E8F0] hover:border-[#0056D2]/30 transition-all duration-300 group">
            <div className="relative w-full h-full">
              <Image
                src={partner.logo}
                alt={`${partner.name} logo`}
                fill
                className="object-contain filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              />
            </div>
          </div>
        );

        if (partner.website) {
          return (
            <a
              key={partner.name + index}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="block outline-none focus-visible:ring-2 focus-visible:ring-[#0056D2] rounded-[10px]"
              aria-label={`Visit ${partner.name} website`}
            >
              {logoContent}
            </a>
          );
        }

        return (
          <div key={partner.name + index} className="block">
            {logoContent}
          </div>
        );
      })}
    </div>
  );
}
