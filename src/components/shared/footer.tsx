import Link from 'next/link';
import { ExternalLink as Linkedin, Camera as Instagram, Mail } from 'lucide-react';
import { SITE_CONFIG, NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F172A] text-white pt-16 pb-8 border-t border-[#1E293B]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          {/* Brand & Description */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-white">
                HRDC
              </span>
              <span className="text-2xl font-light text-slate-300">
                SRCC
              </span>
            </Link>
            <p className="text-slate-400 text-[15px] leading-relaxed">
              Human Resources Development Cell, Shri Ram College of Commerce. We aim to enable, edify, and empower the students to become future leaders.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white mb-2">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/projects" className="text-slate-400 hover:text-[#0056D2] transition-colors text-[15px]">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/publications" className="text-slate-400 hover:text-[#0056D2] transition-colors text-[15px]">
                  Publications
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-slate-400 hover:text-[#0056D2] transition-colors text-[15px]">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/impact" className="text-slate-400 hover:text-[#0056D2] transition-colors text-[15px]">
                  Impact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white mb-2">Contact Us</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3">
                <Mail size={20} className="text-slate-400 mt-0.5" />
                <a href={`mailto:${SITE_CONFIG.email || 'hrdc@srcc.edu'}`} className="text-slate-400 hover:text-white transition-colors text-[15px]">
                  {SITE_CONFIG.email || 'hrdc@srcc.edu'}
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white mb-2">Follow Us</h3>
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#0056D2] hover:text-white transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
            <p className="text-slate-400 text-sm mt-4 italic">
              "Enable. Edify. Empower."
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1E293B] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} HRDC SRCC. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
