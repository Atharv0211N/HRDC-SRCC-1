export const dynamic = 'force-dynamic';
import { getTeamMembers } from '@/actions/team';
import { TeamManagement } from '@/components/dashboard/team-management';
import { TeamMember } from '@prisma/client';

export const metadata = {
  title: 'Team Management | HRDC Dashboard',
};

export default async function TeamPage() {
  const teamMembers = await getTeamMembers();

  return (
    <div className="w-full">
      <TeamManagement initialData={teamMembers.data || []} />
    </div>
  );
}
