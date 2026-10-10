import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventCardProps {
  title: string;
  slug: string;
  date: string | Date;
  category: string;
  heroImage: string;
  description: string;
}

export function EventCard({ title, slug, date, category, heroImage, description }: EventCardProps) {
  // Format date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Link href={`/events/${slug}`} className="group block h-full">
      <article className="h-full flex flex-col bg-white rounded-[14px] border border-[#E2E8F0] overflow-hidden hover:shadow-md transition-all duration-300">
        <div className="relative w-full aspect-video overflow-hidden bg-[#F8FAFC]">
          <Image
            src={heroImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-[#0F172A] shadow-sm">
              {category}
            </span>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2 text-sm text-[#64748B] mb-3">
            <Calendar size={16} />
            <time dateTime={typeof date === 'string' ? date : date.toISOString()}>{formattedDate}</time>
          </div>

          <h3 className="text-xl font-bold text-[#0F172A] mb-3 group-hover:text-[#0056D2] transition-colors line-clamp-2">
            {title}
          </h3>
          
          <p className="text-[15px] text-[#475569] leading-relaxed mb-6 line-clamp-2 flex-1">
            {description}
          </p>
          
          <div className="flex items-center text-[#0056D2] text-[15px] font-medium mt-auto">
            View Details
            <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </article>
    </Link>
  );
}
