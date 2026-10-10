export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Hero } from '@/components/shared/hero';
import { SectionHeader } from '@/components/shared/section-header';
import { ProjectCard } from '@/components/shared/project-card';
import { EmptyState } from '@/components/shared/empty-state';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Projects | HRDC SRCC',
  description: 'Explore the flagship initiatives and projects by the Human Resources Development Cell, SRCC.',
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { isDeleted: false },
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <>
      <Hero
        title="Our Projects"
        description="Discover our flagship initiatives designed to foster growth, learning, and leadership among students."
        compact
      />

      <section className="section-padding bg-surface">
        <div className="container-main">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-text-primary mb-4">Driving Impact Through Action</h2>
              <p className="text-lg text-text-secondary">
                Our projects are at the heart of HRDC's mission. Through meticulously planned initiatives, we aim to bridge the gap between theoretical knowledge and practical application, nurturing the leaders of tomorrow.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    name={project.name}
                    slug={project.slug}
                    shortDescription={project.shortDescription}
                    coverImage={project.coverImage}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No projects found"
                description="Check back later for updates on our upcoming initiatives."
              />
            )}
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-text-primary mb-6">Interested in our work?</h2>
            <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
              Whether you want to collaborate, participate, or just learn more about what we do, we're always open to connecting.
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
