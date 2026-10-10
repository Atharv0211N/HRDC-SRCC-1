import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
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
      <article className="h-full flex flex-col bg-white rounded-[14px] border border-[#E2E8F0] overflow-hidden hover:shadow-md transition-all duration-300">
        <div className={cn(
          "relative w-full overflow-hidden bg-[#F8FAFC]",
          isMagazine ? "aspect-[3/4]" : "aspect-video"
        )}>
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-[#0F172A] text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
              {type}
            </span>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-1">
          <time dateTime={typeof date === 'string' ? date : date.toISOString()} className="text-sm text-[#64748B] mb-2 block">
            {new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </time>

          <h3 className="text-xl font-bold text-[#0F172A] mb-3 group-hover:text-[#0056D2] transition-colors line-clamp-2">
            {title}
          </h3>
          
          <p className="text-[15px] text-[#475569] leading-relaxed mb-6 line-clamp-3 flex-1">
            {summary}
          </p>
          
          <div className="flex items-center text-[#0056D2] text-[15px] font-medium mt-auto">
            Read More
            <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </article>
    </Link>
  );
}
