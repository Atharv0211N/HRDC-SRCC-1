export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import Link from 'next';
import { Hero } from '@/components/shared/hero';
import { SectionHeader } from '@/components/shared/section-header';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { StaggerChildren } from '@/components/motion/stagger-children';
import { SITE_CONFIG, CORE_VALUES, CAPABILITIES } from '@/lib/constants';
import { Lightbulb, BookOpen, Rocket, Search, Briefcase, GraduationCap, Heart, Users, Target, BarChart, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import LinkComponent from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: `Learn about the ${SITE_CONFIG.orgName} (${SITE_CONFIG.shortName}), our mission, values, and how we operate.`,
};

const valueIcons = [Lightbulb, BookOpen, Rocket];

const capabilityIcons = {
  Search,
  BookOpen,
  Briefcase,
  GraduationCap,
  Heart,
};

const differentiators = [
  {
    title: 'Student-led Leadership',
    description: 'Empowering students to take charge of initiatives, fostering practical leadership skills and autonomous decision-making.',
    icon: Users,
  },
  {
    title: 'Industry Engagement',
    description: 'Bridging the gap between academia and corporate reality through direct collaboration with industry leaders.',
    icon: Target,
  },
  {
    title: 'Research-driven Initiatives',
    description: 'Basing our projects and publications on rigorous research to ensure relevance and substantive impact.',
    icon: BarChart,
  },
  {
    title: 'Long-term Impact',
    description: 'Focusing on sustainable programs that create lasting value for our members, partners, and the community.',
    icon: ShieldCheck,
  },
];

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col w-full">
      <Hero
        title={`About ${SITE_CONFIG.shortName}`}
        description="Fostering human potential through research, development, and meaningful initiatives."
        compact
      />

      {/* Who We Are */}
      <section className="section-padding bg-surface">
        <div className="container-main">
          <ScrollReveal>
            <SectionHeader
              title="Who We Are"
              align="center"
              className="mb-12"
            />
            <div className="mx-auto max-w-3xl text-center space-y-6 text-lg text-text-secondary">
              <p>
                Founded in {SITE_CONFIG.founded}, the {SITE_CONFIG.orgName} ({SITE_CONFIG.shortName}) at {SITE_CONFIG.institution} stands as a premier student-led organization dedicated to the holistic development of human resources.
              </p>
              <p>
                We serve as a vital bridge between academic learning and industry practice. By cultivating an environment that encourages intellectual curiosity, leadership, and professional excellence, we prepare our members to navigate and shape the future of work and organizational management.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission & Core Values */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <ScrollReveal>
            <SectionHeader
              title="Mission & Core Values"
              description="The guiding principles that shape our initiatives and define our organizational culture."
              align="center"
              className="mb-16"
            />
          </ScrollReveal>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CORE_VALUES.map((value, index) => {
              const Icon = valueIcons[index % valueIcons.length];
              return (
                <div
                  key={value.title}
                  className="p-8 rounded-lg border border-border bg-surface hover:shadow-hover transition-shadow duration-300 flex flex-col items-center text-center"
                >
                  <div className="mb-6 p-4 rounded-full bg-primary/10 text-primary">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-4">{value.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* Our Journey */}
      <section className="section-padding bg-surface">
        <div className="container-main">
          <ScrollReveal>
            <SectionHeader
              title="Our Journey"
              align="center"
              className="mb-12"
            />
            <div className="mx-auto max-w-3xl space-y-6 text-lg text-text-secondary">
              <p>
                Since our inception, {SITE_CONFIG.shortName} has evolved from a nascent idea into a structured, impactful organization. We began with a simple goal: to provide students with a platform to explore human resource management beyond textbooks. Over the years, this vision has expanded dramatically.
              </p>
              <p>
                We have continuously adapted our approach to align with the changing dynamics of the corporate world. From initiating our flagship events to establishing dedicated wings for research and project development, our journey reflects a steadfast commitment to growth and excellence. Today, we are proud of our legacy of creating meaningful collaborations and empowering countless individuals through our comprehensive programs.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How HRDC Operates */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <ScrollReveal>
            <SectionHeader
              title="How We Operate"
              description="Our capabilities and functional domains."
              align="center"
              className="mb-16"
            />
          </ScrollReveal>

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAPABILITIES.map((capability) => {
              const Icon = capabilityIcons[capability.icon as keyof typeof capabilityIcons] || Lightbulb;
              return (
                <div
                  key={capability.title}
                  className="p-6 rounded-md border border-border bg-white hover:border-primary/30 transition-colors duration-300 flex items-start gap-4"
                >
                  <div className="mt-1 p-2 rounded-md bg-primary/5 text-primary shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-text-primary mb-2">{capability.title}</h4>
                    <p className="text-sm text-text-secondary leading-relaxed">{capability.description}</p>
                  </div>
                </div>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* Organization Structure */}
      <section className="section-padding bg-surface">
        <div className="container-main">
          <ScrollReveal>
            <SectionHeader
              title="Organization Structure"
              description="A systematic approach to leadership and execution."
              align="center"
              className="mb-16"
            />
            
            <div className="max-w-4xl mx-auto overflow-x-auto pb-8">
              <div className="min-w-[600px] flex flex-col items-center">
                {/* President */}
                <div className="px-6 py-3 bg-primary text-white font-medium rounded-sm shadow-subtle mb-8 relative">
                  President
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-8 bg-border"></div>
                </div>

                {/* VP & GS */}
                <div className="flex gap-16 mb-12 relative w-full justify-center">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-[calc(100%-8rem)] max-w-sm h-px bg-border"></div>
                  
                  <div className="px-6 py-3 bg-white border border-border text-text-primary font-medium rounded-sm shadow-subtle relative">
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-px h-8 bg-border"></div>
                    Vice President
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-12 bg-border"></div>
                  </div>
                  
                  <div className="px-6 py-3 bg-white border border-border text-text-primary font-medium rounded-sm shadow-subtle relative">
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-px h-8 bg-border"></div>
                    General Secretary
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-12 bg-border"></div>
                  </div>
                </div>

                <div className="w-full max-w-3xl h-px bg-border mb-8 relative"></div>

                {/* Departments */}
                <div className="grid grid-cols-4 gap-4 w-full">
                  {['Research & Editorial', 'Creative & Technical', 'Project & Development', 'Event & Corporate'].map((dept) => (
                    <div key={dept} className="flex flex-col items-center">
                      <div className="absolute -mt-8 w-px h-8 bg-border"></div>
                      <div className="px-4 py-2 bg-white border border-border text-text-primary text-sm font-medium text-center rounded-sm shadow-subtle mb-4 w-full h-full flex items-center justify-center">
                        {dept} Wing
                      </div>
                      <div className="w-px h-4 bg-border mb-4"></div>
                      <div className="px-3 py-1.5 bg-surface border border-border text-text-secondary text-xs text-center rounded-sm w-[90%]">
                        Chief Coordinators
                      </div>
                      <div className="w-px h-4 bg-border"></div>
                      <div className="px-3 py-1.5 bg-surface border border-border text-text-secondary text-xs text-center rounded-sm w-[90%] mt-2">
                        Directors
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* What Makes HRDC Different */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <ScrollReveal>
            <SectionHeader
              title="The HRDC Difference"
              align="center"
              className="mb-16"
            />
          </ScrollReveal>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {differentiators.map((diff) => {
              const Icon = diff.icon;
              return (
                <div key={diff.title} className="flex gap-6 p-6 rounded-md bg-surface border border-border">
                  <div className="shrink-0 p-3 rounded-full bg-primary/10 text-primary h-fit">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-text-primary mb-2">{diff.title}</h4>
                    <p className="text-text-secondary text-sm leading-relaxed">{diff.description}</p>
                  </div>
                </div>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-white">
        <div className="container-main text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Discover Our Work</h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
              Explore the tangible impact we've created through our projects, publications, and events.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <LinkComponent
                href="/projects"
                className="px-8 py-3 bg-white text-primary font-medium rounded-md hover:bg-surface transition-colors"
              >
                Explore Projects
              </LinkComponent>
              <LinkComponent
                href="/impact"
                className="px-8 py-3 bg-primary border-2 border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors"
              >
                See Our Impact
              </LinkComponent>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
