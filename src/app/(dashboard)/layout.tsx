import { redirect } from 'next/navigation';
import { auth } from '@/auth';
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

  if (!session || !session.user) {
    redirect('/login');
  }

  const role = session.user.role || 'ADMIN';

  return (
    <DashboardShell 
      user={{ name: session.user.name || session.user.email || 'Admin', role: role as string }}
    >
      {children}
    </DashboardShell>
  );
}
