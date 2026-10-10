export const dynamic = 'force-dynamic';
import { getProjects } from '@/actions/projects';
import { ProjectManagement } from '@/components/dashboard/project-management';

export const metadata = {
  title: 'Project Management | HRDC Dashboard',
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="w-full">
      <ProjectManagement initialData={projects.data || []} />
    </div>
  );
}
