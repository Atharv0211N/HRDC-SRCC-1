import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PublicationCardProps {
  title: string;
  slug: string;
  type: string;
  date: string | Date;
  coverImage: string;
  summary: string;
}

export function PublicationCard({ title, slug, type, date, coverImage, summary }: PublicationCardProps) {
  const isMagazine = type.toLowerCase() === 'magazine';
  
  return (
    <Link href={`/publications/${slug}`} className="group block h-full">
      <article className="h-full flex flex-col bg-white rounded-[16px] border border-[#E2E8F0] overflow-hidden card-hover-lift">
        <div className={cn(
          "relative w-full overflow-hidden bg-[#F8FAFC]",
          isMagazine ? "aspect-[3/4]" : "aspect-video"
        )}>
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="bg-[#0F172A]/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold shadow-xs">
              {type}
            </span>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-1">
          <time dateTime={typeof date === 'string' ? date : date.toISOString()} className="text-xs font-medium text-[#64748B] mb-2 block">
            {new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </time>

          <h3 className="text-xl font-bold text-[#0F172A] mb-2.5 group-hover:text-[#0056D2] transition-colors line-clamp-2">
            {title}
          </h3>

          <p className="text-[14px] text-[#475569] leading-relaxed mb-6 line-clamp-3 flex-1">
            {summary}
          </p>

          <div className="flex items-center justify-between text-[#0056D2] text-[14px] font-semibold mt-auto pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <BookOpen size={15} />
              Read Publication
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </div>
        </div>
      </article>
    </Link>
  );
}
