import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-[#64748B]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center gap-2">
              {isLast ? (
                <span className="font-semibold text-[#0F172A]" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link 
                    href={item.href || '#'} 
                    className="hover:text-[#0056D2] transition-colors"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight size={14} className="text-[#E2E8F0]" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
