import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn('px-4 py-2 bg-[#0056D2] text-white rounded-[10px] hover:bg-[#004AB8] transition-colors', className)}
      {...props}
    />
  );
});
Button.displayName = 'Button';
