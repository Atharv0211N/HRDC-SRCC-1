export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { PUBLICATION_TYPE_LABELS } from '@/lib/constants';
import { Hero } from '@/components/shared/hero';
import { SectionHeader } from '@/components/shared/section-header';
import { PublicationCard } from '@/components/shared/publication-card';
import { EmptyState } from '@/components/shared/empty-state';
import { ScrollReveal } from '@/components/motion/scroll-reveal';

export const metadata: Metadata = {
  title: 'Publications | HRDC SRCC',
  description: 'Read the latest magazines, reports, and articles published by the Human Resources Development Cell, SRCC.',
};

export default async function PublicationsPage() {
  const [featuredPub, publications] = await Promise.all([
    prisma.publication.findFirst({
      where: { featured: true, isDeleted: false },
      orderBy: { date: 'desc' },
    }),
    prisma.publication.findMany({
      where: { isDeleted: false },
      orderBy: { date: 'desc' },
    }),
  ]);

  return (
    <>
      <Hero
        title="Publications"
        description="Dive into our extensive research, editorial insights, and thought leadership reports."
        compact
      />

      {featuredPub && (
        <section className="section-padding bg-surface">
          <div className="container-main">
            <ScrollReveal>
              <div className="bg-white rounded-2xl shadow-modal overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8 lg:p-12">
                <div className="relative aspect-[3/4] w-full max-w-sm mx-auto md:order-last shadow-hover rounded-xl overflow-hidden">
                  <Image
                    src={featuredPub.coverImage || '/images/placeholder.jpg'}
                    alt={featuredPub.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-accent text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-sm">
                    Featured
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-primary font-bold text-sm uppercase tracking-wider">
                      {PUBLICATION_TYPE_LABELS[featuredPub.type as keyof typeof PUBLICATION_TYPE_LABELS] || featuredPub.type}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                    <span className="text-text-muted text-sm">
                      {formatDate(featuredPub.date)}
                    </span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4 leading-tight">
                    {featuredPub.title}
                  </h2>
                  <p className="text-text-secondary mb-8 text-lg line-clamp-4">
                    {featuredPub.summary}
                  </p>
                  <div>
                    <Link
                      href={`/publications/${featuredPub.slug}`}
                      className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shadow-sm"
                    >
                      Read Publication
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      <section className="py-8 bg-white border-b border-border">
        <div className="container-main">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {Object.values(PUBLICATION_TYPE_LABELS).map((label, idx) => (
              <div key={idx} className="text-text-secondary font-medium px-4 py-2 bg-surface rounded-full text-sm">
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-main">
          <SectionHeader
            title="All Publications"
            description="Explore our complete collection of insights."
          />
          <ScrollReveal delay={0.2}>
            {publications.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {publications.map((pub) => (
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
            ) : (
              <EmptyState
                title="No Publications Found"
                description="We haven't published anything yet. Check back soon!"
              />
            )}
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-primary text-white">
        <div className="container-main text-center max-w-3xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-4">HRDC Newsletter</h2>
            <p className="text-white/80 mb-8 text-lg">
              Stay updated with our latest thoughts, reports, and events delivered straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-4 py-3 rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
              <button 
                type="button"
                className="bg-accent text-white px-6 py-3 rounded-md font-medium hover:bg-accent/90 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-text-primary mb-6">Have questions?</h2>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border-2 border-primary text-primary px-8 py-3 text-sm font-medium transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Contact HRDC
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
