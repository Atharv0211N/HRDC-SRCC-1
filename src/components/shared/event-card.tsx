import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';

interface EventCardProps {
  title: string;
  slug: string;
  date: string | Date;
  category: string;
  heroImage: string;
  description: string;
}

export function EventCard({ title, slug, date, category, heroImage, description }: EventCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Link href={`/events/${slug}`} className="group block h-full">
      <article className="h-full flex flex-col bg-white rounded-[16px] border border-[#E2E8F0] overflow-hidden card-hover-lift">
        <div className="relative w-full aspect-video overflow-hidden bg-[#F8FAFC]">
          <Image
            src={heroImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#0F172A] shadow-xs border border-white/50">
              {category}
            </span>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#64748B] mb-2.5">
            <Calendar size={14} className="text-[#0056D2]" />
            <time dateTime={typeof date === 'string' ? date : date.toISOString()}>{formattedDate}</time>
          </div>

          <h3 className="text-xl font-bold text-[#0F172A] mb-2.5 group-hover:text-[#0056D2] transition-colors line-clamp-2">
            {title}
          </h3>
          
          <p className="text-[14px] text-[#475569] leading-relaxed mb-6 line-clamp-2 flex-1">
            {description}
          </p>
          
          <div className="flex items-center text-[#0056D2] text-[14px] font-semibold mt-auto pt-2 border-t border-slate-100">
            <span>View Details</span>
            <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </div>
        </div>
      </article>
    </Link>
  );
}
