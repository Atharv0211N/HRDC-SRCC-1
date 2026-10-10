import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      <article className="h-full flex flex-col bg-white rounded-[14px] border border-[#E2E8F0] overflow-hidden hover:shadow-md transition-all duration-300">
        <div className="relative w-full aspect-video overflow-hidden bg-[#F8FAFC]">
          <Image
            src={coverImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-xl font-bold text-[#0F172A] mb-3 group-hover:text-[#0056D2] transition-colors line-clamp-1">
            {name}
          </h3>
          
          <p className="text-[15px] text-[#475569] leading-relaxed mb-6 line-clamp-3 flex-1">
            {shortDescription}
          </p>
          
          <div className="flex items-center text-[#0056D2] text-[15px] font-medium mt-auto">
            Learn More
            <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </article>
    </Link>
  );
}
