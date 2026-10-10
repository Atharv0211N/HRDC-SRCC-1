export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Hero } from '@/components/shared/hero';
import { SectionHeader } from '@/components/shared/section-header';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { StaggerChildren } from '@/components/motion/stagger-children';
import { TeamCard } from '@/components/shared/team-card';
import { DEPARTMENT_LABELS } from '@/lib/constants';
import Link from 'next/link';
import { Department } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Team',
  description: 'Meet the dedicated leaders and members driving the Human Resource Development Cell.',
};

export default async function TeamPage() {
  const allMembers = await prisma.teamMember.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  // Separate leadership (Presidency) from other departments
  const leadershipMembers = allMembers.filter(m => m.department === 'PRESIDENCY');
  const executiveMembers = allMembers.filter(m => m.department !== 'PRESIDENCY');

  // Group executive members by department
  const groupedExecutives = executiveMembers.reduce((acc, member) => {
    if (!acc[member.department]) {
      acc[member.department] = [];
    }
    acc[member.department].push(member);
    return acc;
  }, {} as Record<string, typeof allMembers>);

  // Order of departments for display
  const departmentOrder: Department[] = [
    'RESEARCH_EDITORIAL',
    'CREATIVE_TECHNICAL',
    'PROJECT_DEVELOPMENT',
    'EVENT_CORPORATE'
  ];

  return (
    <main className="flex min-h-screen flex-col w-full">
      <Hero
        title="Our Team"
        description="The dedicated minds and passionate leaders working tirelessly to realize HRDC's vision."
        compact
      />

      {/* Leadership Section */}
      {leadershipMembers.length > 0 && (
        <section className="section-padding bg-surface">
          <div className="container-main">
            <ScrollReveal>
              <SectionHeader
                title="Leadership"
                description="Guiding the organization towards excellence and sustainable impact."
                align="center"
                className="mb-12"
              />
            </ScrollReveal>
            
            <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
              <StaggerChildren className="flex flex-wrap justify-center gap-8 w-full">
                {leadershipMembers.map(member => (
                  <div key={member.id} className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1.5rem)] max-w-sm">
                    <TeamCard
                      name={member.name}
                      designation={member.designation}
                      photo={member.photo}
                      linkedIn={member.linkedIn || undefined}
                      featured={true}
                    />
                  </div>
                ))}
              </StaggerChildren>
            </div>
          </div>
        </section>
      )}

      {/* Executive Cabinet Section */}
      {Object.keys(groupedExecutives).length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-main">
            <ScrollReveal>
              <SectionHeader
                title="Executive Cabinet"
                description="The driving force across our specialized domains."
                align="center"
                className="mb-16"
              />
            </ScrollReveal>

            <div className="space-y-20">
              {departmentOrder.map(deptKey => {
                const members = groupedExecutives[deptKey];
                if (!members || members.length === 0) return null;
                
                return (
                  <div key={deptKey} className="space-y-8">
                    <ScrollReveal>
                      <h3 className="text-2xl font-bold text-text-primary text-center md:text-left border-b border-border pb-4">
                        {DEPARTMENT_LABELS[deptKey] || deptKey}
                      </h3>
                    </ScrollReveal>
                    
                    <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {members.map(member => (
                        <TeamCard
                          key={member.id}
                          name={member.name}
                          designation={member.designation}
                          photo={member.photo}
                          linkedIn={member.linkedIn || undefined}
                          featured={false}
                        />
                      ))}
                    </StaggerChildren>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-primary text-white">
        <div className="container-main text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Connect With Us</h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
              Interested in collaborating, seeking consultation, or just want to learn more about our work?
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-white text-primary font-medium rounded-md hover:bg-surface transition-colors"
            >
              Get in Touch
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
