export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Hero } from '@/components/shared/hero';
import { SectionHeader } from '@/components/shared/section-header';
import { EventCard } from '@/components/shared/event-card';
import { EmptyState } from '@/components/shared/empty-state';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { EVENT_CATEGORY_LABELS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Events | HRDC SRCC',
  description: 'Join our upcoming events, workshops, and seminars hosted by the Human Resources Development Cell, SRCC.',
};

export default async function EventsPage() {
  const [featuredEvent, upcomingEvents, archivedEvents] = await Promise.all([
    prisma.event.findFirst({
      where: { featured: true, isDeleted: false },
      orderBy: { date: 'desc' },
    }),
    prisma.event.findMany({
      where: { archived: false, isDeleted: false, date: { gte: new Date() } },
      orderBy: { date: 'asc' },
    }),
    prisma.event.findMany({
      where: {
        OR: [{ archived: true }, { date: { lt: new Date() } }],
        isDeleted: false,
      },
      orderBy: { date: 'desc' },
    }),
  ]);

  return (
    <>
      <Hero
        title="Events & Workshops"
        description="Engage, learn, and grow with our carefully curated events featuring industry leaders and experts."
        compact
      />

      {featuredEvent && (
        <section className="section-padding bg-surface">
          <div className="container-main">
            <ScrollReveal>
              <div className="bg-white rounded-2xl shadow-modal overflow-hidden grid grid-cols-1 lg:grid-cols-2">
                <div className="relative aspect-video lg:aspect-auto">
                  <Image
                    src={featuredEvent.heroImage || '/images/placeholder.jpg'}
                    alt={featuredEvent.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                    Featured
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-accent font-semibold">{formatDate(featuredEvent.date)}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                    <span className="text-text-muted text-sm font-medium uppercase tracking-wider">
                      {EVENT_CATEGORY_LABELS[featuredEvent.category as keyof typeof EVENT_CATEGORY_LABELS] || featuredEvent.category}
                    </span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4 leading-tight">
                    {featuredEvent.title}
                  </h2>
                  <p className="text-text-secondary mb-8 line-clamp-3">
                    {featuredEvent.description}
                  </p>
                  <div>
                    <Link
                      href={`/events/${featuredEvent.slug}`}
                      className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      <section className="section-padding bg-white">
        <div className="container-main">
          <SectionHeader
            title="Upcoming Events"
            description="Don't miss out on our future engagements."
          />
          <ScrollReveal delay={0.2}>
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    title={event.title}
                    slug={event.slug}
                    date={event.date}
                    category={event.category}
                    heroImage={event.heroImage}
                    description={event.description}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Upcoming Events"
                description="We are currently planning our next events. Stay tuned!"
              />
            )}
          </ScrollReveal>
        </div>
      </section>

      {archivedEvents.length > 0 && (
        <section className="section-padding bg-surface">
          <div className="container-main">
            <SectionHeader
              title="Past Events Archive"
              description="Explore the legacy of our previous successful events."
            />
            <ScrollReveal delay={0.2}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {archivedEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    title={event.title}
                    slug={event.slug}
                    date={event.date}
                    category={event.category}
                    heroImage={event.heroImage}
                    description={event.description}
                  />
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      <section className="section-padding bg-white">
        <div className="container-main text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-text-primary mb-6">Have an idea for collaboration?</h2>
            <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
              We are always on the lookout for exciting partnerships and fresh ideas.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Contact HRDC
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
