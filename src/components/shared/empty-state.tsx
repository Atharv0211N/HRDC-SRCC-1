import React from 'react';
import { cn } from '@/lib/utils';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-[14px] border border-dashed border-[#E2E8F0]">
      <div className="w-16 h-16 bg-[#F8FAFC] rounded-full flex items-center justify-center text-[#64748B] mb-6">
        {icon || <SearchX size={32} />}
      </div>
      <h3 className="text-xl font-bold text-[#0F172A] mb-2">{title}</h3>
      {description && (
        <p className="text-[15px] text-[#475569] max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
