import Image from 'next/image';
import { ExternalLink as Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeamCardProps {
  name: string;
  designation: string;
  photo: string;
  linkedIn?: string;
  featured?: boolean;
}

export function TeamCard({ name, designation, photo, linkedIn, featured = false }: TeamCardProps) {
  return (
    <div className={cn(
      "flex flex-col group",
      featured ? "p-6 bg-white rounded-[18px] border border-[#E2E8F0] shadow-sm" : ""
    )}>
      <div className={cn(
        "relative overflow-hidden bg-[#F8FAFC] mb-4 mx-auto w-full",
        featured ? "aspect-square rounded-[14px]" : "aspect-square rounded-full max-w-[200px]"
      )}>
        <Image
          src={photo}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={featured ? "(max-width: 768px) 100vw, 400px" : "(max-width: 768px) 200px, 200px"}
        />
        {linkedIn && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <a
              href={linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#0056D2] hover:bg-[#0056D2] hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
              aria-label={`${name}'s LinkedIn profile`}
            >
              <Linkedin size={24} />
            </a>
          </div>
        )}
      </div>

      <div className={cn(
        "text-center",
        !featured && "mt-2"
      )}>
        <h3 className={cn(
          "font-bold text-[#0F172A] mb-1",
          featured ? "text-xl" : "text-lg"
        )}>
          {name}
        </h3>
        <p className={cn(
          "text-[#475569] font-medium",
          featured ? "text-[15px]" : "text-sm"
        )}>
          {designation}
        </p>
      </div>
    </div>
  );
}
