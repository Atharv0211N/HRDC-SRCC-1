'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/constants';

interface NavbarProps {
  recruitmentOpen?: boolean;
}

export function Navbar({ recruitmentOpen = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white shadow-sm py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold text-[#0F172A] tracking-tight group-hover:text-[#0056D2] transition-colors">
              HRDC
            </span>
            <span className="text-2xl font-light text-[#475569]">
              SRCC
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-[15px] font-medium transition-colors hover:text-[#0056D2]',
                    isActive ? 'text-[#0056D2]' : 'text-[#475569]'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {recruitmentOpen && (
              <Link
                href="/join"
                className="hidden md:inline-flex items-center justify-center bg-[#0056D2] text-white px-6 py-2.5 rounded-[10px] text-[15px] font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                Join HRDC
              </Link>
            )}
            
            <button
              className="md:hidden p-2 text-[#0F172A]"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/20" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={cn(
          'fixed top-0 left-0 bottom-0 z-[70] w-[280px] bg-white shadow-lg transition-transform duration-300 ease-in-out transform',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0]">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-[#0F172A]">HRDC</span>
              <span className="text-xl font-light text-[#475569]">SRCC</span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-[#475569] hover:text-[#0F172A] transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-6 px-4">
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'px-4 py-3 rounded-[10px] text-[15px] font-medium transition-colors',
                      isActive 
                        ? 'bg-[#F8FAFC] text-[#0056D2]' 
                        : 'text-[#0F172A] hover:bg-[#F8FAFC] hover:text-[#0056D2]'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {recruitmentOpen && (
            <div className="p-6 border-t border-[#E2E8F0]">
              <Link
                href="/join"
                className="flex items-center justify-center w-full bg-[#0056D2] text-white px-6 py-3 rounded-[10px] text-[15px] font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                Join HRDC
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
