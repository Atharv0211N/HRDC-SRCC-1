export const dynamic = 'force-dynamic';
import { getPublications } from '@/actions/publications';
import { PublicationManagement } from '@/components/dashboard/publication-management';

export const metadata = {
  title: 'Publication Management | HRDC Dashboard',
};

export default async function PublicationsPage() {
  const publications = await getPublications();

  return (
    <div className="w-full">
      <PublicationManagement initialData={publications.data || []} />
    </div>
  );
}
