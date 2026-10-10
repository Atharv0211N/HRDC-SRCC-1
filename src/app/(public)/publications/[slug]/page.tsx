import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { PUBLICATION_TYPE_LABELS } from '@/lib/constants';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { PublicationCard } from '@/components/shared/publication-card';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { FadeIn } from '@/components/motion/fade-in';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const publication = await prisma.publication.findUnique({
    where: { slug, isDeleted: false },
  });

  if (!publication) return { title: 'Publication Not Found' };

  return {
    title: `${publication.title} | HRDC SRCC`,
    description: publication.summary.slice(0, 150) + '...',
  };
}

export default async function PublicationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const publication = await prisma.publication.findUnique({
    where: { slug, isDeleted: false },
  });

  if (!publication) notFound();

  const relatedPublications = await prisma.publication.findMany({
    where: { 
      type: publication.type,
      id: { not: publication.id },
      isDeleted: false 
    },
    take: 3,
    orderBy: { date: 'desc' },
  });

  return (
    <>
      <section className="bg-surface pt-8 pb-16">
        <div className="container-main">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Publications', href: '/publications' },
              { label: publication.title },
            ]}
          />
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <FadeIn>
                <div className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-modal">
                  <Image
                    src={publication.coverImage || '/images/placeholder.jpg'}
                    alt={publication.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </FadeIn>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2">
              <FadeIn delay={0.2}>
                <div className="flex items-center gap-4 mb-6">
                  <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                    {PUBLICATION_TYPE_LABELS[publication.type as keyof typeof PUBLICATION_TYPE_LABELS] || publication.type}
                  </span>
                  <span className="text-text-muted font-medium">{formatDate(publication.date)}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-6">
                  {publication.title}
                </h1>
                <p className="text-xl text-text-secondary leading-relaxed mb-8">
                  {publication.summary}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  {publication.pdfUrl && (
                    <a
                      href={publication.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90 shadow-sm"
                    >
                      Download PDF
                    </a>
                  )}
                  {publication.externalLink && (
                    <a
                      href={publication.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md border border-primary text-primary px-6 py-3 text-sm font-medium transition-colors hover:bg-primary/5"
                    >
                      Read Externally
                    </a>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {publication.content && (
        <section className="section-padding bg-white">
          <div className="container-main">
            <ScrollReveal>
              <div className="max-w-4xl mx-auto prose prose-lg prose-slate">
                {publication.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-text-secondary leading-relaxed mb-6">
                    {paragraph}
                  </p>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {publication.tags.length > 0 && (
        <section className="py-12 bg-white border-t border-border">
          <div className="container-main max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-text-primary font-semibold">Tags:</span>
                {publication.tags.map((tag, idx) => (
                  <span key={idx} className="bg-surface border border-border text-text-secondary text-sm px-3 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {relatedPublications.length > 0 && (
        <section className="section-padding bg-surface">
          <div className="container-main">
            <ScrollReveal>
              <h2 className="text-3xl font-bold text-text-primary mb-10 text-center">Related Publications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPublications.map((pub) => (
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
        </section>
      )}

      <section className="section-padding bg-white">
        <div className="container-main text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-text-primary mb-6">Explore More</h2>
            <Link
              href="/publications"
              className="inline-flex items-center justify-center rounded-md border-2 border-primary text-primary px-8 py-3 text-sm font-medium transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              All Publications
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
