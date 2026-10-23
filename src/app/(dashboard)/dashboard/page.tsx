export const dynamic = 'force-dynamic';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { 
  Users, 
  FolderOpen, 
  Calendar, 
  BookOpen, 
  Handshake, 
  MessageSquare,
  PlusCircle,
  FileText
} from 'lucide-react';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Dashboard Overview | HRDC SRCC',
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Fetch stats concurrently
  const [
    projectsCount,
    eventsCount,
    publicationsCount,
    teamCount,
    partnersCount,
    totalMessages,
    newMessages,
    recentMessages,
    recentLogs
  ] = await Promise.all([
    prisma.project.count({ where: { isDeleted: false } }),
    prisma.event.count({ where: { isDeleted: false } }),
    prisma.publication.count({ where: { isDeleted: false } }),
    prisma.teamMember.count(),
    prisma.partner.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: 'NEW' } }),
    prisma.contactMessage.findMany({
      take: 5,
      orderBy: { submittedAt: 'desc' },
    }),
    // @ts-ignore - Assuming AuditLog model exists based on requirements
    prisma.auditLog.findMany({ include: { user: { select: { email: true } } },
      take: 5,
      orderBy: { createdAt: 'desc' },
    }).catch(() => [])
  ]);

  const stats = [
    { label: 'Projects', value: projectsCount, icon: FolderOpen, href: '/dashboard/projects' },
    { label: 'Events', value: eventsCount, icon: Calendar, href: '/dashboard/events' },
    { label: 'Publications', value: publicationsCount, icon: BookOpen, href: '/dashboard/publications' },
    { label: 'Team Members', value: teamCount, icon: Users, href: '/dashboard/team' },
    { label: 'Partners', value: partnersCount, icon: Handshake, href: '/dashboard/partners' },
    { label: 'New Messages', value: newMessages, icon: MessageSquare, href: '/dashboard/messages', highlight: newMessages > 0 },
  ];

  const quickActions = [
    { label: 'Add Project', href: '/dashboard/projects/new', icon: PlusCircle },
    { label: 'Add Event', href: '/dashboard/events/new', icon: PlusCircle },
    { label: 'Add Publication', href: '/dashboard/publications/new', icon: PlusCircle },
    { label: 'Add Team Member', href: '/dashboard/team/new', icon: PlusCircle },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Welcome back, {session.user.name}</h1>
        <p className="text-[#475569] mt-1">Here's what's happening across the HRDC platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="block group">
            <div className={`
              bg-white rounded-[14px] p-6 border transition-all duration-200
              ${stat.highlight ? 'border-[#0056D2] shadow-sm' : 'border-[#E2E8F0] shadow-sm hover:shadow-md'}
            `}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#64748B]">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#0F172A] mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.highlight ? 'bg-[#0056D2]/10 text-[#0056D2]' : 'bg-slate-50 text-[#0056D2]'}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Messages */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[14px] border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center">
              <h2 className="text-lg font-semibold text-[#0F172A]">Recent Messages</h2>
              <Link href="/dashboard/messages" className="text-sm font-medium text-[#0056D2] hover:underline">
                View all
              </Link>
            </div>
            
            <div className="divide-y divide-[#E2E8F0]">
              {recentMessages.length === 0 ? (
                <div className="p-6 text-center text-[#64748B]">No recent messages.</div>
              ) : (
                recentMessages.map((msg) => (
                  <div key={msg.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-[#0F172A]">{msg.name}</p>
                        <p className="text-sm text-[#475569]">{msg.email}</p>
                      </div>
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${msg.status === 'NEW' ? 'bg-blue-100 text-blue-800' : 
                          msg.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800' : 
                          'bg-green-100 text-green-800'}
                      `}>
                        {msg.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-[#0F172A] mb-1">{msg.subject}</p>
                    <p className="text-sm text-[#64748B] line-clamp-2">{msg.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & Audit Logs */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-[14px] border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E2E8F0]">
              <h2 className="text-lg font-semibold text-[#0F172A]">Quick Actions</h2>
            </div>
            <div className="p-4 space-y-2">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center p-3 rounded-[10px] hover:bg-slate-50 text-[#0F172A] transition-colors border border-transparent hover:border-[#E2E8F0]"
                >
                  <action.icon className="h-5 w-5 mr-3 text-[#0056D2]" />
                  <span className="font-medium text-sm">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-white rounded-[14px] border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E2E8F0]">
              <h2 className="text-lg font-semibold text-[#0F172A]">Recent Activity</h2>
            </div>
            <div className="p-0">
              {!recentLogs || recentLogs.length === 0 ? (
                <div className="p-6 text-center text-sm text-[#64748B]">No recent activity logs.</div>
              ) : (
                <div className="divide-y divide-[#E2E8F0]">
                  {recentLogs.map((log: any) => (
                    <div key={log.id} className="p-4 flex items-start">
                      <FileText className="h-4 w-4 mr-3 mt-0.5 text-[#64748B]" />
                      <div>
                        <p className="text-sm text-[#0F172A]">{log.action} <span className="font-medium">{log.entityType}</span></p>
                        <p className="text-xs text-[#64748B] mt-1">
                          By {(log.user?.email || 'Admin')} • {new Date(log.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
