import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ProjectCardProps {
  name: string;
  slug: string;
  shortDescription: string;
  coverImage: string;
  displayOrder?: number;
}

export function ProjectCard({ name, slug, shortDescription, coverImage }: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`} className="group block h-full">
      <article className="h-full flex flex-col bg-white rounded-[16px] border border-[#E2E8F0] overflow-hidden card-hover-lift">
        <div className="relative w-full aspect-video overflow-hidden bg-[#F8FAFC]">
          <Image
            src={coverImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="p-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[#0056D2] shadow-sm flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-xl font-bold text-[#0F172A] mb-2.5 group-hover:text-[#0056D2] transition-colors line-clamp-1">
            {name}
          </h3>
          
          <p className="text-[14px] text-[#475569] leading-relaxed mb-6 line-clamp-3 flex-1">
            {shortDescription}
          </p>
          
          <div className="flex items-center text-[#0056D2] text-[14px] font-semibold mt-auto pt-2 border-t border-slate-100">
            <span>Explore Case Study</span>
            <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </div>
        </div>
      </article>
    </Link>
  );
}
