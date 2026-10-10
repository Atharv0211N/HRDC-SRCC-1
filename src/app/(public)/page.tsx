export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Hero } from '@/components/shared/hero';
import { SectionHeader } from '@/components/shared/section-header';
import { StatCard } from '@/components/shared/stat-card';
import { ProjectCard } from '@/components/shared/project-card';
import { EventCard } from '@/components/shared/event-card';
import { PublicationCard } from '@/components/shared/publication-card';
import { TeamCard } from '@/components/shared/team-card';
import { PartnerGrid } from '@/components/shared/partner-grid';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { StaggerChildren } from '@/components/motion/stagger-children';
import { FadeIn } from '@/components/motion/fade-in';
import { CAPABILITIES, SECTION_IDS } from '@/lib/constants';
import { Search, BookOpen, Briefcase, GraduationCap, Heart, ArrowRight } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'HRDC SRCC — Enable. Edify. Empower.',
  description: 'The Human Resource Development Cell at Shri Ram College of Commerce is dedicated to fostering personal and professional growth.',
};

const iconMap: Record<string, React.ElementType> = {
  Search,
  BookOpen,
  Briefcase,
  GraduationCap,
  Heart,
};

export default async function HomePage() {
  const [
    homepage,
    statistics,
    projects,
    latestEvents,
    latestPublications,
    featuredTeam,
    partners,
    settings,
  ] = await Promise.all([
    prisma.homepageContent.findFirst({ where: { isActive: true } }),
    prisma.statistic.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.project.findMany({ where: { featured: true, isDeleted: false }, orderBy: { displayOrder: 'asc' } }),
    prisma.event.findMany({ where: { isDeleted: false }, orderBy: { date: 'desc' }, take: 3 }),
    prisma.publication.findMany({ where: { isDeleted: false }, orderBy: { date: 'desc' }, take: 3 }),
    prisma.teamMember.findMany({ where: { featuredOnHomepage: true }, orderBy: { displayOrder: 'asc' } }),
    prisma.partner.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.siteSettings.findFirst(),
  ]);

  let lookingAheadItems = [];
  try {
    if (homepage?.lookingAheadItems) {
      lookingAheadItems = JSON.parse(homepage.lookingAheadItems as string);
    }
  } catch (e) {
    console.error('Error parsing lookingAheadItems', e);
  }

  // Combine events and publications for Latest Work
  const latestWork = [...latestEvents.map(e => ({ ...e, _type: 'event' })), ...latestPublications.map(p => ({ ...p, _type: 'publication' }))]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="w-full">
      {/* SECTION 1: Hero */}
      <section id={SECTION_IDS.hero}>
        <Hero
          title={homepage?.heroTitle || 'Enable. Edify. Empower.'}
          description={homepage?.heroSubtitle || 'Fostering human capital development and holistic growth.'}
          ctaText={homepage?.heroCtaText || 'Learn More'}
          ctaHref={homepage?.heroCtaLink || '/about'}
          secondaryCtaText={homepage?.heroSecondaryCtaText || 'View Projects'}
          secondaryCtaHref={homepage?.heroSecondaryCtaLink || '/projects'}
          imageSrc="/images/placeholder-hero.jpg"
          imageAlt="HRDC SRCC Hero"
          compact={false}
        />
      </section>

      {/* SECTION 2: Impact Dashboard */}
      {statistics.length > 0 && (
        <section id={SECTION_IDS.impact} className="section-padding bg-surface">
          <div className="container-main">
            <ScrollReveal>
              <SectionHeader
                label="Our Impact"
                title="Numbers That Speak"
                align="center"
              />
              <StaggerChildren className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statistics.map((stat) => (
                  <StatCard
                    key={stat.id}
                    value={stat.value}
                    label={stat.label}
                    description={stat.description || undefined}
                  />
                ))}
              </StaggerChildren>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* SECTION 3: What We Do */}
      <section id={SECTION_IDS.whatWeDo} className="section-padding bg-white">
        <div className="container-main">
          <ScrollReveal>
            <SectionHeader
              label="Our Work"
              title="What We Do"
              align="center"
            />
            <StaggerChildren className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
              {CAPABILITIES.map((capability, idx) => {
                const Icon = iconMap[capability.icon] || Heart;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-border rounded-md p-6 shadow-subtle hover:shadow-hover transition-shadow duration-300"
                  >
                    <div className="w-12 h-12 bg-surface text-primary rounded-sm flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-3">
                      {capability.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {capability.description}
                    </p>
                  </div>
                );
              })}
            </StaggerChildren>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 4: Flagship Projects */}
      {projects.length > 0 && (
        <section id={SECTION_IDS.projects} className="section-padding bg-surface">
          <div className="container-main">
            <ScrollReveal>
              <SectionHeader
                label="Initiatives"
                title="Flagship Projects"
                ctaText="View All Projects"
                ctaHref="/projects"
              />
              <StaggerChildren className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    name={project.name}
                    slug={project.slug}
                    shortDescription={project.shortDescription || ''}
                    coverImage={project.coverImage || '/images/placeholder-project.jpg'}
                  />
                ))}
              </StaggerChildren>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* SECTION 5: Who We Are */}
      <section id={SECTION_IDS.whoWeAre} className="section-padding bg-white">
        <div className="container-main">
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-4 block">Who We Are</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
                  Fostering Human Capital Since 2008
                </h2>
                <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                  The Human Resource Development Cell (HRDC) is a premier student-run organization at Shri Ram College of Commerce. We are driven by the motto 'Enable. Edify. Empower.' and act as a catalyst in cultivating the next generation of leaders, thinkers, and innovators.
                </p>
                <Link href="/about" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-sm hover:bg-blue-700 transition-colors">
                  Learn More About HRDC
                </Link>
              </div>
              <div className="relative aspect-square md:aspect-video lg:aspect-square rounded-lg overflow-hidden bg-surface">
                <Image
                  src="/images/placeholder-about.jpg"
                  alt="HRDC Team"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 6: Minductor */}
      <section id={SECTION_IDS.minductor} className="section-padding bg-surface">
        <div className="container-main">
          <ScrollReveal>
            <div className="bg-white border border-border rounded-lg overflow-hidden shadow-subtle flex flex-col md:flex-row">
              <div className="md:w-1/2 relative min-h-[300px] md:min-h-full">
                <Image
                  src="/images/placeholder-minductor.jpg"
                  alt="Minductor"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Flagship Event</span>
                <h3 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  Minductor
                </h3>
                <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                  Our annual flagship festival, Minductor, brings together industry leaders, visionaries, and eager minds for a series of workshops, speaker sessions, and competitions designed to challenge and inspire.
                </p>
                <Link href="/events" className="inline-flex items-center text-primary font-semibold hover:text-blue-700 transition-colors">
                  Explore Events <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 7: Latest Work */}
      {latestWork.length > 0 && (
        <section id="latest-work" className="section-padding bg-white">
          <div className="container-main">
            <ScrollReveal>
              <SectionHeader
                label="Recent"
                title="Latest Work"
              />
              <StaggerChildren className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {latestWork.map((item: any) => (
                  <Link href={`/${item._type}s/${item.slug}`} key={`${item._type}-${item.id}`} className="group block">
                    <div className="relative aspect-video rounded-md overflow-hidden mb-4 bg-surface">
                      <Image
                        src={item.heroImage || item.coverImage || '/images/placeholder-latest.jpg'}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-surface px-2 py-1 rounded-sm">
                        {item._type === 'event' ? item.category || 'Event' : item.type || 'Publication'}
                      </span>
                      <span className="text-sm text-text-muted">
                        {formatDate(item.date)}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                  </Link>
                ))}
              </StaggerChildren>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* SECTION 8: Publications Preview */}
      {latestPublications.length > 0 && (
        <section id={SECTION_IDS.publications} className="section-padding bg-surface">
          <div className="container-main">
            <ScrollReveal>
              <SectionHeader
                label="Knowledge"
                title="Publications & Insights"
                ctaText="View All Publications"
                ctaHref="/publications"
              />
              <StaggerChildren className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {latestPublications.map((pub) => (
                  <PublicationCard
                    key={pub.id}
                    title={pub.title}
                    slug={pub.slug}
                    type={pub.type}
                    date={pub.date}
                    coverImage={pub.coverImage || '/images/placeholder-pub.jpg'}
                    summary={pub.summary || ''}
                  />
                ))}
              </StaggerChildren>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* SECTION 9: Looking Ahead */}
      {homepage?.lookingAheadTitle && lookingAheadItems.length > 0 && (
        <section id="looking-ahead" className="section-padding bg-white">
          <div className="container-main">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
                  {homepage.lookingAheadTitle}
                </h2>
                {homepage.lookingAheadDescription && (
                  <p className="text-text-secondary text-lg">
                    {homepage.lookingAheadDescription}
                  </p>
                )}
              </div>
              <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {lookingAheadItems.map((item: any, index: number) => (
                  <div key={index} className="p-8 border border-border rounded-md bg-surface text-center">
                    <h3 className="text-xl font-bold text-text-primary mb-4">{item.title}</h3>
                    <p className="text-text-secondary">{item.description}</p>
                  </div>
                ))}
              </StaggerChildren>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* SECTION 10: Inside HRDC */}
      <section id="inside-hrdc" className="section-padding bg-surface">
        <div className="container-main">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Inside HRDC</h2>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                A glimpse into HRDC — events, workshops, and the people who make it happen.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
              <div className="col-span-2 row-span-2 relative rounded-md overflow-hidden bg-white">
                <Image src="/images/placeholder-bento-1.jpg" alt="Inside HRDC 1" fill className="object-cover" />
              </div>
              <div className="col-span-1 row-span-1 relative rounded-md overflow-hidden bg-white">
                <Image src="/images/placeholder-bento-2.jpg" alt="Inside HRDC 2" fill className="object-cover" />
              </div>
              <div className="col-span-1 row-span-1 relative rounded-md overflow-hidden bg-white">
                <Image src="/images/placeholder-bento-3.jpg" alt="Inside HRDC 3" fill className="object-cover" />
              </div>
              <div className="col-span-2 row-span-1 relative rounded-md overflow-hidden bg-white">
                <Image src="/images/placeholder-bento-4.jpg" alt="Inside HRDC 4" fill className="object-cover" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 11: Partners */}
      {partners.length > 0 && (
        <section id="partners" className="section-padding bg-white">
          <div className="container-main">
            <ScrollReveal>
              <SectionHeader
                label="Collaborations"
                title="Our Partners"
                align="center"
              />
              <div className="mt-12">
                <PartnerGrid partners={partners} />
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* SECTION 12: Leadership Preview */}
      {featuredTeam.length > 0 && (
        <section id={SECTION_IDS.leadership} className="section-padding bg-surface">
          <div className="container-main">
            <ScrollReveal>
              <SectionHeader
                label="Our People"
                title="Leadership"
                ctaText="Meet the Team"
                ctaHref="/team"
                align="center"
              />
              <StaggerChildren className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                {featuredTeam.map((member) => (
                  <TeamCard
                    key={member.id}
                    name={member.name}
                    designation={member.designation}
                    photo={member.photo || '/images/placeholder-team.jpg'}
                    linkedIn={member.linkedIn || undefined}
                    featured={true}
                  />
                ))}
              </StaggerChildren>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* SECTION 13: Contact CTA */}
      <section id={SECTION_IDS.contact} className="py-24 bg-surface border-t border-border">
        <div className="container-main text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
              Interested in Collaborating?
            </h2>
            <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Whether you are an industry professional, a prospective partner, or a student eager to learn, we would love to hear from you.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold text-lg rounded-sm hover:bg-blue-700 transition-colors shadow-subtle hover:shadow-hover"
            >
              Contact HRDC
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* SECTION 14: Footer - Handled by Layout */}
    </div>
  );
}
