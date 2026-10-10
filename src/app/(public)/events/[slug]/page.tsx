import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { EVENT_CATEGORY_LABELS } from '@/lib/constants';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { ProjectCard } from '@/components/shared/project-card';
import { PublicationCard } from '@/components/shared/publication-card';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { FadeIn } from '@/components/motion/fade-in';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug, isDeleted: false },
  });

  if (!event) return { title: 'Event Not Found' };

  return {
    title: `${event.title} | HRDC SRCC`,
    description: event.description.slice(0, 150) + '...',
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug, isDeleted: false },
    include: {
      relatedProject: { where: { isDeleted: false } },
      relatedPublication: { where: { isDeleted: false } },
    },
  });

  if (!event) notFound();

  let speakers: any[] = [];
  if (event.speakers) {
    try {
      speakers = typeof event.speakers === 'string' ? JSON.parse(event.speakers as string) : event.speakers;
    } catch (e) {
      console.error('Failed to parse speakers JSON');
    }
  }

  return (
    <>
      <section className="bg-surface pt-8 pb-12">
        <div className="container-main">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Events', href: '/events' },
              { label: event.title },
            ]}
          />
          <div className="mt-10 max-w-4xl mx-auto text-center">
            <FadeIn>
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-accent font-semibold">{formatDate(event.date)}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                  {EVENT_CATEGORY_LABELS[event.category as keyof typeof EVENT_CATEGORY_LABELS] || event.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-8">
                {event.title}
              </h1>
            </FadeIn>
          </div>
          
          <FadeIn delay={0.2}>
            <div className="relative w-full max-w-5xl mx-auto aspect-[21/9] rounded-2xl overflow-hidden shadow-modal mt-8">
              <Image
                src={event.heroImage || '/images/placeholder.jpg'}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="lg:col-span-2">
              <ScrollReveal>
                <h2 className="text-3xl font-bold text-text-primary mb-6">Overview</h2>
                <div className="prose prose-lg prose-slate max-w-none">
                  {event.description.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="text-text-secondary leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </ScrollReveal>
            </div>
            
            <div>
              {event.highlights.length > 0 && (
                <ScrollReveal delay={0.2}>
                  <div className="bg-surface rounded-xl p-8 border border-border">
                    <h3 className="text-xl font-bold text-text-primary mb-4">Highlights</h3>
                    <ul className="space-y-3">
                      {event.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-primary mr-3"></span>
                          <span className="text-text-secondary">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </div>
      </section>

      {speakers.length > 0 && (
        <section className="section-padding bg-surface">
          <div className="container-main">
            <ScrollReveal>
              <h2 className="text-3xl font-bold text-text-primary mb-10 text-center">Speakers & Guests</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {speakers.map((speaker, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-6 text-center shadow-subtle border border-border">
                    <div className="w-24 h-24 mx-auto bg-surface rounded-full mb-4 overflow-hidden relative">
                       {speaker.image ? (
                          <Image src={speaker.image} alt={speaker.name} fill className="object-cover"/>
                       ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary text-2xl font-bold">
                             {speaker.name.charAt(0)}
                          </div>
                       )}
                    </div>
                    <h3 className="text-lg font-bold text-text-primary">{speaker.name}</h3>
                    {speaker.title && <p className="text-sm text-primary font-medium mt-1">{speaker.title}</p>}
                    {speaker.organization && <p className="text-xs text-text-muted mt-2">{speaker.organization}</p>}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {event.gallery.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-main">
            <ScrollReveal>
              <h2 className="text-3xl font-bold text-text-primary mb-10 text-center">Event Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {event.gallery.map((image, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden shadow-subtle group">
                    <Image
                      src={image}
                      alt={`${event.title} gallery image ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {(event.relatedProject || event.relatedPublication) && (
        <section className="section-padding bg-surface">
          <div className="container-main">
            <ScrollReveal>
              <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">Related Content</h2>
              <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
                {event.relatedProject && (
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-secondary mb-4">Project</h3>
                    <ProjectCard
                      name={event.relatedProject.name}
                      slug={event.relatedProject.slug}
                      shortDescription={event.relatedProject.shortDescription}
                      coverImage={event.relatedProject.coverImage}
                    />
                  </div>
                )}
                {event.relatedPublication && (
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-secondary mb-4">Publication</h3>
                    <PublicationCard
                      title={event.relatedPublication.title}
                      slug={event.relatedPublication.slug}
                      type={event.relatedPublication.type}
                      date={event.relatedPublication.date}
                      coverImage={event.relatedPublication.coverImage}
                      summary={event.relatedPublication.summary}
                    />
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      <section className="section-padding bg-white">
        <div className="container-main text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-text-primary mb-6">Discover More</h2>
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-md border-2 border-primary text-primary px-8 py-3 text-sm font-medium transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Explore More Events
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
