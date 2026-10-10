'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
}

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  user: {
    name: string;
    role: string;
  };
}

export default function DashboardShell({ children, navItems, user }: DashboardShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#F8FAFC] border-r border-[#E2E8F0] transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:flex md:flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-[#E2E8F0]">
          <span className="text-[#0F172A] font-bold text-lg tracking-tight">HRDC Admin</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-[10px] transition-colors
                  ${isActive 
                    ? 'bg-[#0056D2] text-white' 
                    : 'text-[#475569] hover:bg-slate-200 hover:text-[#0F172A]'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#E2E8F0]">
          <div className="mb-4 px-2">
            <p className="text-sm font-medium text-[#0F172A]">{user.name}</p>
            <p className="text-xs text-[#64748B]">{user.role}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex w-full items-center px-3 py-2 text-sm font-medium rounded-[10px] text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white border-b border-[#E2E8F0]">
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 -ml-2 text-[#475569] hover:bg-slate-100 rounded-md"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          <div className="flex-1 flex justify-end">
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-[#0F172A]">{user.name}</span>
                <span className="text-xs text-[#64748B] bg-slate-100 px-2 py-0.5 rounded-full">{user.role}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
