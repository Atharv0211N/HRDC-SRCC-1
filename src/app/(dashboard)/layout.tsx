import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  Calendar, 
  BookOpen, 
  Home, 
  BarChart3, 
  Handshake, 
  MessageSquare, 
  Settings, 
  Shield, 
  Image as ImageIcon,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import DashboardShell from './DashboardShell';


export const metadata = {
  title: 'Admin Dashboard | HRDC SRCC',
  description: 'Admin dashboard for HRDC SRCC',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const role = session.user.role;

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Team', href: '/dashboard/team', icon: Users },
    { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
    { name: 'Events', href: '/dashboard/events', icon: Calendar },
    { name: 'Publications', href: '/dashboard/publications', icon: BookOpen },
    { name: 'Homepage', href: '/dashboard/homepage', icon: Home },
    { name: 'Statistics', href: '/dashboard/statistics', icon: BarChart3 },
    { name: 'Partners', href: '/dashboard/partners', icon: Handshake },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ...(role === 'SUPER_ADMIN' ? [{ name: 'Admins', href: '/dashboard/admins', icon: Shield }] : []),
    { name: 'Media', href: '/dashboard/media', icon: ImageIcon },
  ];

  return (
    <DashboardShell 
      navItems={navItems} 
      user={{ name: session.user.name || 'Admin', role: role as string }}
    >
      {children}
    </DashboardShell>
  );
}
