export const dynamic = 'force-dynamic';
import { getEvents } from '@/actions/events';
import { EventManagement } from '@/components/dashboard/event-management';

export const metadata = {
  title: 'Event Management | HRDC Dashboard',
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="w-full">
      <EventManagement initialData={events.data || []} />
    </div>
  );
}
