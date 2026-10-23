'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';
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
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-xs border-b border-slate-200/70 py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-[52px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-[8px] bg-[#0056D2] text-white font-black text-sm flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              H
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-[#0F172A] tracking-tight group-hover:text-[#0056D2] transition-colors">
                HRDC
              </span>
              <span className="text-xs font-semibold text-[#64748B] tracking-wider uppercase">
                SRCC
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-full border border-slate-200/60 backdrop-blur-sm">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200',
                    isActive
                      ? 'bg-white text-[#0056D2] shadow-xs'
                      : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/50'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action */}
          <div className="hidden md:flex items-center gap-3">
            {recruitmentOpen ? (
              <Link
                href="/recruitment"
                className="inline-flex items-center gap-1.5 bg-[#0056D2] hover:bg-[#0045A8] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xs transition-all hover:shadow-md"
              >
                <span>Recruitment Active</span>
                <ArrowRight size={13} />
              </Link>
            ) : (
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 bg-[#0F172A] hover:bg-slate-800 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xs transition-all"
              >
                <span>Get in Touch</span>
                <ArrowRight size={13} />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-[#E2E8F0] shadow-lg animate-in slide-in-from-top-4 duration-200">
          <div className="container mx-auto px-6 py-5 flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'py-2.5 px-3 rounded-lg text-sm font-semibold transition-colors',
                    isActive
                      ? 'bg-blue-50 text-[#0056D2]'
                      : 'text-[#475569] hover:bg-slate-50'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-100 mt-2">
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center bg-[#0056D2] text-white py-2.5 rounded-lg text-xs font-semibold shadow-xs"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
