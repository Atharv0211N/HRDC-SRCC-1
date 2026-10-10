export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Hero } from '@/components/shared/hero';
import { SectionHeader } from '@/components/shared/section-header';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { StaggerChildren } from '@/components/motion/stagger-children';
import { StatCard } from '@/components/shared/stat-card';
import { PartnerGrid } from '@/components/shared/partner-grid';
import { Trophy, Award, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Impact',
  description: 'Measurable achievements and the lasting difference created by HRDC.',
};

const achievements = [
  {
    icon: Trophy,
    title: 'Best Student Organization',
    description: 'Recognized for outstanding contribution to student development and community impact.',
  },
  {
    icon: Award,
    title: 'Excellence in Research',
    description: 'Awarded for publishing comprehensive industry reports that bridge academia and corporate realities.',
  },
  {
    icon: Star,
    title: 'Community Leadership',
    description: 'Commended for initiatives that drive social change and empower underprivileged youth.',
  },
];

export default async function ImpactPage() {
  // Fetch data concurrently
  const [statistics, partners, publicationCount] = await Promise.all([
    prisma.statistic.findMany({
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.partner.findMany({
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.publication.count({
      where: { isDeleted: false },
    }),
  ]);

  return (
    <main className="flex min-h-screen flex-col w-full">
      <Hero
        title="Our Impact"
        description="Measuring our success by the tangible difference we make in the community and corporate world."
        compact
      />

      {/* Impact Statistics */}
      {statistics.length > 0 && (
        <section className="section-padding bg-surface">
          <div className="container-main">
            <ScrollReveal>
              <SectionHeader
                title="By the Numbers"
                description="Quantifiable metrics that highlight the scale of our reach and effectiveness."
                align="center"
                className="mb-12"
              />
            </ScrollReveal>
            
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {statistics.map((stat) => (
                <StatCard
                  key={stat.id}
                  value={stat.value}
                  label={stat.label}
                  description={stat.description || undefined}
                />
              ))}
            </StaggerChildren>
          </div>
        </section>
      )}

      {/* Achievements */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <ScrollReveal>
            <SectionHeader
              title="Key Achievements"
              description="Milestones that validate our commitment to excellence."
              align="center"
              className="mb-12"
            />
          </ScrollReveal>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div 
                  key={index}
                  className="p-8 rounded-lg border border-border bg-surface hover:border-[#C8A45D]/50 transition-colors duration-300 flex flex-col items-center text-center relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#C8A45D] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                  
                  <div className="mb-6 p-4 rounded-full bg-[#C8A45D]/10 text-[#C8A45D]">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-4">{achievement.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{achievement.description}</p>
                </div>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* Research & Publications */}
      <section className="section-padding bg-surface">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <h2 className="text-3xl font-bold text-text-primary mb-4">Research & Publications</h2>
              <p className="text-lg text-text-secondary mb-6">
                Our intellectual capital is one of our strongest assets. Through rigorous analysis and dedicated effort, we produce insights that matter.
              </p>
              <div className="flex items-center gap-4 mb-8">
                <div className="text-4xl font-bold text-primary">{publicationCount}+</div>
                <div className="text-sm text-text-secondary font-medium uppercase tracking-wider">
                  Published<br/>Works
                </div>
              </div>
              <Link 
                href="/publications"
                className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
              >
                View our publications
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </ScrollReveal>
            
            <ScrollReveal direction="right">
              <div className="aspect-video bg-border rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Placeholder for a publication mockup or abstract graphic */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10"></div>
                <BookOpen className="w-24 h-24 text-primary/20" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Collaborations */}
      {partners.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-main">
            <ScrollReveal>
              <SectionHeader
                title="Institutional Collaborations"
                description="We partner with leading organizations to deliver exceptional value and foster mutual growth."
                align="center"
                className="mb-12"
              />
              <div className="max-w-3xl mx-auto mb-16 text-center text-text-secondary text-lg">
                <p>
                  Our network spans industry leaders, academic institutions, and community organizations. These collaborations enable us to bring real-world perspectives into our initiatives and extend our positive impact beyond the campus.
                </p>
              </div>
            </ScrollReveal>

            <PartnerGrid partners={partners.map(p => ({
              name: p.name,
              logo: p.logo,
              website: p.website || undefined
            }))} />
          </div>
        </section>
      )}

      {/* Community Outreach */}
      <section className="section-padding bg-surface">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left" className="order-2 md:order-1">
              <div className="aspect-square md:aspect-auto md:h-full min-h-[300px] bg-border rounded-lg flex items-center justify-center overflow-hidden relative">
                {/* Placeholder for outreach photo */}
                <div className="absolute inset-0 bg-primary/5"></div>
                <div className="text-text-muted flex flex-col items-center">
                  <Heart className="w-16 h-16 mb-4 opacity-50" />
                  <span>EduWave Initiative</span>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="right" className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-text-primary mb-6">Community Outreach</h2>
              <div className="space-y-4 text-lg text-text-secondary">
                <p>
                  Beyond corporate readiness, HRDC is deeply committed to social responsibility. Our flagship community initiative, <strong>EduWave</strong>, focuses on empowering underprivileged students through targeted educational interventions and mentorship.
                </p>
                <p>
                  By leveraging the skills and dedication of our members, we conduct workshops on soft skills, basic financial literacy, and career guidance. We believe that true leadership involves lifting others as we climb, and our outreach programs are a testament to this philosophy.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Looking Ahead */}
      <section className="section-padding bg-white">
        <div className="container-main text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-text-primary mb-6">Looking Ahead</h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto mb-10">
              Our journey of impact does not stop here. As we look to the future, HRDC is focused on expanding our digital footprint, fostering more international collaborations, and innovating our approach to human resource development. We remain steadfast in our mission to Enable, Edify, and Empower.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-white">
        <div className="container-main text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience Our Initiatives</h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
              See firsthand the projects and events that drive our impact.
            </p>
            <Link
              href="/projects"
              className="inline-block px-8 py-3 bg-white text-primary font-medium rounded-md hover:bg-surface transition-colors"
            >
              See Our Work
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}

// Ensure proper import for BookOpen and Heart if they weren't fully defined above
import { BookOpen, Heart } from 'lucide-react';
