import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { EventCard } from '@/components/shared/event-card';
import { PublicationCard } from '@/components/shared/publication-card';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { FadeIn } from '@/components/motion/fade-in';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug, isDeleted: false },
  });

  if (!project) return { title: 'Project Not Found' };

  return {
    title: `${project.name} | HRDC SRCC`,
    description: project.shortDescription,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug, isDeleted: false },
    include: {
      events: { where: { isDeleted: false } },
      publications: { where: { isDeleted: false } },
    },
  });

  if (!project) notFound();

  return (
    <>
      <section className="bg-surface pt-8 pb-12">
        <div className="container-main">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Projects', href: '/projects' },
              { label: project.name },
            ]}
          />
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight mb-6">
                {project.name}
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed">
                {project.shortDescription}
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-modal">
                <Image
                  src={project.coverImage || '/images/placeholder.jpg'}
                  alt={project.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto prose prose-lg prose-slate">
              <h2 className="text-3xl font-bold text-text-primary mb-6">Overview</h2>
              {project.fullDescription.split('\n').map((paragraph, idx) => (
                <p key={idx} className="text-text-secondary mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {(project.objectives.length > 0 || project.activities.length > 0) && (
        <section className="section-padding bg-surface">
          <div className="container-main max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {project.objectives.length > 0 && (
                <ScrollReveal>
                  <h3 className="text-2xl font-bold text-text-primary mb-6">Objectives</h3>
                  <ul className="space-y-4">
                    {project.objectives.map((objective, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mr-4 mt-1">
                          {idx + 1}
                        </span>
                        <span className="text-text-secondary leading-relaxed">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollReveal>
              )}
              
              {project.activities.length > 0 && (
                <ScrollReveal delay={0.2}>
                  <h3 className="text-2xl font-bold text-text-primary mb-6">Key Activities</h3>
                  <ul className="space-y-4">
                    {project.activities.map((activity, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-accent mr-4"></span>
                        <span className="text-text-secondary leading-relaxed">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollReveal>
              )}
            </div>
          </div>
        </section>
      )}

      {project.impactSummary && (
        <section className="section-padding bg-primary text-white">
          <div className="container-main max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <h2 className="text-3xl font-bold mb-6">Our Impact</h2>
              <p className="text-xl text-white/90 leading-relaxed">
                {project.impactSummary}
              </p>
            </ScrollReveal>
          </div>
        </section>
      )}

      {project.gallery.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-main">
            <ScrollReveal>
              <h2 className="text-3xl font-bold text-text-primary mb-10 text-center">Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.gallery.map((image, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden shadow-subtle group">
                    <Image
                      src={image}
                      alt={`${project.name} gallery image ${idx + 1}`}
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

      {(project.events.length > 0 || project.publications.length > 0) && (
        <section className="section-padding bg-surface">
          <div className="container-main">
            {project.events.length > 0 && (
              <div className="mb-16">
                <ScrollReveal>
                  <h2 className="text-3xl font-bold text-text-primary mb-8">Related Events</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {project.events.map((event) => (
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
            )}

            {project.publications.length > 0 && (
              <div>
                <ScrollReveal>
                  <h2 className="text-3xl font-bold text-text-primary mb-8">Related Publications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {project.publications.map((pub) => (
                      <PublicationCard
                        key={pub.id}
                        title={pub.title}
                        slug={pub.slug}
                        type={pub.type}
                        date={pub.date}
                        coverImage={pub.coverImage}
                        summary={pub.summary}
                      />
                    ))}
                  </div>
                </ScrollReveal>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="section-padding bg-white">
        <div className="container-main text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-text-primary mb-6">Discover More</h2>
            <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
              Explore our other initiatives and see how we are making a difference.
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-md border-2 border-primary text-primary px-8 py-3 text-sm font-medium transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Explore More Projects
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
