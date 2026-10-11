import { Role, Department, EventCategory, PublicationType, PartnerCategory } from '@prisma/client';
import { hash } from 'bcryptjs';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('🌱 Seeding HRDC SRCC database...\n');

  // ============================================
  // 1. SITE SETTINGS
  // ============================================
  console.log('⚙️  Creating site settings...');
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'default-settings' },
    update: {},
    create: {
      id: 'default-settings',
      orgName: 'Human Resource Development Cell',
      institution: 'Shri Ram College of Commerce, University of Delhi',
      founded: '2008',
      motto: 'Enable. Edify. Empower.',
      primaryEmail: 'hrdc@srcc.du.ac.in',
      address: 'Shri Ram College of Commerce, University of Delhi, Maurice Nagar, Delhi - 110007',
      linkedIn: 'https://linkedin.com/company/hrdc-srcc',
      instagram: 'https://instagram.com/hrdc_srcc',
      recruitmentOpen: false,
      recruitmentFormUrl: '',
      defaultSeoTitle: 'HRDC SRCC — Enable. Edify. Empower.',
      defaultSeoDescription: 'The Human Resource Development Cell, Shri Ram College of Commerce — one of the most established student-led organizations at the University of Delhi. Research, consulting, publications, and professional development since 2008.',
    },
  });
  console.log(`   ✓ Site settings created (id: ${settings.id})`);

  // ============================================
  // 2. ADMIN USER (Super Admin)
  // ============================================
  console.log('\n👤 Creating admin user...');
  const passwordHash = await hash('Admin@HRDC2024', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hrdc-srcc.org' },
    update: {},
    create: {
      email: 'admin@hrdc-srcc.org',
      passwordHash,
      name: 'HRDC Admin',
      role: Role.SUPER_ADMIN,
    },
  });
  console.log(`   ✓ Admin user created (email: ${admin.email})`);

  // ============================================
  // 3. HOMEPAGE CONTENT
  // ============================================
  console.log('\n🏠 Creating homepage content...');
  const homepage = await prisma.homepageContent.upsert({
    where: { id: 'default-homepage' },
    update: {},
    create: {
      id: 'default-homepage',
      heroTitle: 'Developing Leaders. Creating Impact.',
      heroSubtitle: 'The Human Resource Development Cell at Shri Ram College of Commerce — driving research, consulting, and professional development since 2008.',
      heroCtaText: 'Explore Our Work',
      heroCtaLink: '/projects',
      heroSecondaryCtaText: 'View Publications',
      heroSecondaryCtaLink: '/publications',
      lookingAheadTitle: 'Looking Ahead',
      lookingAheadDescription: 'HRDC continues to expand its reach through strengthened partnerships, deeper research initiatives, and new opportunities for growth and collaboration.',
      lookingAheadItems: JSON.stringify([
        { title: 'Expanding Partnerships', description: 'Building new institutional and industry relationships to create more collaborative opportunities.' },
        { title: 'Strengthening Research', description: 'Deepening our research capabilities across human resource development and organizational behavior.' },
        { title: 'Increasing Outreach', description: 'Extending community initiatives to create broader social impact beyond the campus.' },
        { title: 'Creating Opportunities', description: 'Developing new programs that prepare students for evolving professional landscapes.' },
      ]),
      isActive: true,
    },
  });
  console.log(`   ✓ Homepage content created (id: ${homepage.id})`);

  // ============================================
  // 4. STATISTICS
  // ============================================
  console.log('\n📊 Creating impact statistics...');
  // PLACEHOLDER: These are example statistics. Replace with verified HRDC data before launch.
  const stats = [
    { label: 'Years Since 2008', value: '17+', description: 'Years of continuous operation as a student-led organization at SRCC.', displayOrder: 1 },
    { label: 'Projects Conducted', value: '25+', description: 'Flagship initiatives including research projects, consulting engagements, and development programs.', displayOrder: 2 },
    { label: 'Publications Released', value: '30+', description: 'Magazines, industry reports, newsletters, and research publications produced.', displayOrder: 3 },
    { label: 'Events Organized', value: '100+', description: 'Conferences, workshops, seminars, and professional development sessions conducted.', displayOrder: 4 },
    { label: 'Students Engaged', value: '5000+', description: 'Students who have participated in HRDC initiatives across academic years.', displayOrder: 5 },
    { label: 'Institutional Collaborations', value: '50+', description: 'Partnerships with organizations, companies, and academic institutions.', displayOrder: 6 },
  ];

  for (const stat of stats) {
    await prisma.statistic.create({ data: stat });
  }
  console.log(`   ✓ ${stats.length} statistics created`);

  // ============================================
  // 5. PROJECTS
  // ============================================
  console.log('\n📁 Creating projects...');
  // PLACEHOLDER: Replace descriptions with actual HRDC project information.
  const projects = [
    {
      name: 'WeHire',
      slug: 'wehire',
      shortDescription: 'A comprehensive recruitment simulation and talent acquisition initiative that bridges the gap between academic learning and professional hiring practices.',
      fullDescription: 'WeHire is HRDC\'s flagship recruitment and talent acquisition project. It provides students with hands-on experience in the complete recruitment lifecycle — from job analysis and candidate sourcing to interviewing, assessment, and selection. The initiative simulates real-world HR processes, preparing participants for careers in human resource management and organizational development.\n\nThrough structured workshops, mock interviews, and industry mentorship, WeHire equips students with practical skills that complement their academic education at SRCC.',
      coverImage: '/images/placeholder-project.jpg',
      objectives: [
        'Simulate real-world recruitment and selection processes',
        'Develop practical talent acquisition skills',
        'Bridge the gap between academic HR theory and industry practice',
        'Prepare students for careers in human resource management',
      ],
      activities: [
        'Recruitment lifecycle simulation',
        'Mock interview sessions with industry professionals',
        'Assessment center design and execution',
        'Talent sourcing and screening workshops',
      ],
      impactSummary: 'WeHire has trained hundreds of students in professional recruitment practices, with many alumni now working in HR roles across leading organizations.',
      featured: true,
      displayOrder: 1,
    },
    {
      name: 'EduWave',
      slug: 'eduwave',
      shortDescription: 'An educational outreach initiative focused on making quality learning resources accessible to underserved communities.',
      fullDescription: 'EduWave represents HRDC\'s commitment to community development through education. The project focuses on creating and distributing quality learning resources to students in underserved communities, fostering educational equity and empowerment.\n\nThrough partnerships with schools, NGOs, and educational institutions, EduWave organizes workshops, mentoring sessions, and resource distribution drives that extend HRDC\'s impact beyond the SRCC campus.',
      coverImage: '/images/placeholder-project.jpg',
      objectives: [
        'Improve access to quality educational resources',
        'Support students in underserved communities',
        'Create sustainable educational partnerships',
        'Develop mentoring frameworks for long-term impact',
      ],
      activities: [
        'Educational resource development and distribution',
        'Mentoring programs for school students',
        'Workshop facilitation in partner schools',
        'Community engagement initiatives',
      ],
      impactSummary: 'EduWave has reached multiple communities, providing educational resources and mentoring support to students who need it most.',
      featured: true,
      displayOrder: 2,
    },
    {
      name: 'StratEdge',
      slug: 'stratedge',
      shortDescription: 'A strategic consulting initiative where students solve real business challenges for organizations using HR and management frameworks.',
      fullDescription: 'StratEdge is HRDC\'s consulting arm, providing students with the opportunity to work on real business challenges faced by organizations. Participants apply academic knowledge in human resource management, organizational behavior, and strategic planning to develop actionable recommendations.\n\nThe project emphasizes structured analytical thinking, professional communication, and evidence-based problem solving, preparing students for careers in management consulting and corporate strategy.',
      coverImage: '/images/placeholder-project.jpg',
      objectives: [
        'Provide hands-on consulting experience',
        'Apply HR and management frameworks to real challenges',
        'Develop analytical and strategic thinking skills',
        'Build professional communication capabilities',
      ],
      activities: [
        'Client engagement and problem definition',
        'Research and data analysis',
        'Strategy formulation and presentation',
        'Consulting skills workshops',
      ],
      impactSummary: 'StratEdge has delivered consulting projects for multiple organizations, giving students practical experience in strategic problem solving.',
      featured: true,
      displayOrder: 3,
    },
    {
      name: 'Personal Enrichment Programme',
      slug: 'pep',
      shortDescription: 'A structured professional development program focused on building essential workplace competencies and leadership capabilities.',
      fullDescription: 'The Personal Enrichment Programme (PEP) is HRDC\'s signature professional development initiative. PEP offers structured training in essential workplace competencies — including communication, leadership, teamwork, time management, and emotional intelligence.\n\nThe program combines workshops, guest lectures, experiential activities, and peer learning to create a comprehensive development experience. PEP helps students transition from academic settings to professional environments with confidence and competence.',
      coverImage: '/images/placeholder-project.jpg',
      objectives: [
        'Develop essential workplace competencies',
        'Build leadership and communication skills',
        'Prepare students for professional environments',
        'Create structured personal development pathways',
      ],
      activities: [
        'Leadership development workshops',
        'Communication skills training',
        'Personality assessment and development',
        'Industry speaker sessions',
      ],
      impactSummary: 'PEP has contributed to the professional development of hundreds of students, equipping them with skills valued across industries.',
      featured: true,
      displayOrder: 4,
    },
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }
  console.log(`   ✓ ${projects.length} projects created`);

  // ============================================
  // 6. EVENTS
  // ============================================
  console.log('\n📅 Creating events...');
  // PLACEHOLDER: Replace with actual HRDC event information.
  const wehireProject = await prisma.project.findUnique({ where: { slug: 'wehire' } });

  const events = [
    {
      title: 'Minductor 2024',
      slug: 'minductor-2024',
      date: new Date('2024-02-15'),
      endDate: new Date('2024-02-16'),
      category: EventCategory.FLAGSHIP,
      description: 'Minductor is HRDC\'s annual flagship event — a premier platform that brings together industry leaders, academics, and students for meaningful discussions on contemporary HR and management topics. The event features panel discussions, keynote addresses, workshops, and networking sessions designed to bridge theory and practice.',
      heroImage: '/images/placeholder-event.jpg',
      highlights: [
        'Keynote addresses by industry leaders',
        'Panel discussions on emerging HR trends',
        'Interactive workshops on professional development',
        'Networking sessions with practitioners and academics',
      ],
      venue: 'Shri Ram College of Commerce, New Delhi',
      featured: true,
      archived: false,
    },
    {
      title: 'HR Leadership Summit',
      slug: 'hr-leadership-summit',
      date: new Date('2024-01-20'),
      category: EventCategory.SEMINAR,
      description: 'A focused seminar exploring contemporary leadership challenges in human resource management. Industry practitioners shared insights on navigating organizational change, building inclusive cultures, and developing future-ready teams.',
      heroImage: '/images/placeholder-event.jpg',
      highlights: [
        'Expert perspectives on organizational leadership',
        'Case studies from leading organizations',
        'Interactive Q&A sessions',
      ],
      venue: 'Shri Ram College of Commerce, New Delhi',
      featured: false,
      archived: true,
    },
    {
      title: 'Recruitment Excellence Workshop',
      slug: 'recruitment-excellence-workshop',
      date: new Date('2023-11-10'),
      category: EventCategory.WORKSHOP,
      description: 'A hands-on workshop focusing on modern recruitment methodologies, talent assessment techniques, and employer branding strategies. Participants gained practical skills in designing effective hiring processes.',
      heroImage: '/images/placeholder-event.jpg',
      highlights: [
        'Modern recruitment methodology training',
        'Assessment center simulation',
        'Employer branding workshop',
      ],
      relatedProjectId: wehireProject?.id,
      venue: 'Shri Ram College of Commerce, New Delhi',
      featured: false,
      archived: true,
    },
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }
  console.log(`   ✓ ${events.length} events created`);

  // ============================================
  // 7. PUBLICATIONS
  // ============================================
  console.log('\n📚 Creating publications...');
  // PLACEHOLDER: Replace with actual HRDC publications.
  const publications = [
    {
      title: 'Vichaar — Annual Magazine 2024',
      slug: 'vichaar-annual-magazine-2024',
      type: PublicationType.MAGAZINE,
      date: new Date('2024-03-01'),
      coverImage: '/images/placeholder-publication.jpg',
      summary: 'The annual flagship publication of HRDC SRCC featuring in-depth articles on human resource development, organizational behavior, leadership, and the evolving workplace. Vichaar represents the collective intellectual output of HRDC members.',
      tags: ['annual-magazine', 'hr-development', 'leadership', 'organizational-behavior'],
      featured: true,
    },
    {
      title: 'The Future of Work — Industry Report 2024',
      slug: 'future-of-work-industry-report-2024',
      type: PublicationType.REPORT,
      date: new Date('2024-01-15'),
      coverImage: '/images/placeholder-publication.jpg',
      summary: 'A comprehensive industry report examining emerging trends in the future of work — including remote work adoption, AI in HR, employee wellbeing, and evolving organizational structures. Based on primary research and industry interviews.',
      tags: ['industry-report', 'future-of-work', 'research', 'ai-in-hr'],
      featured: true,
    },
    {
      title: 'Building Resilient Teams in Uncertain Times',
      slug: 'building-resilient-teams',
      type: PublicationType.BLOG,
      date: new Date('2024-02-20'),
      coverImage: '/images/placeholder-publication.jpg',
      summary: 'An exploration of how organizations can build team resilience through structured development programs, inclusive leadership practices, and adaptive work cultures.',
      content: 'In an era of rapid change and uncertainty, organizational resilience has become a critical competency. This article explores frameworks for building resilient teams that can adapt, recover, and thrive through challenges...',
      tags: ['blog', 'team-resilience', 'leadership', 'organizational-development'],
      featured: false,
    },
    {
      title: 'HRDC Monthly Newsletter — March 2024',
      slug: 'hrdc-newsletter-march-2024',
      type: PublicationType.NEWSLETTER,
      date: new Date('2024-03-15'),
      coverImage: '/images/placeholder-publication.jpg',
      summary: 'Monthly updates from HRDC SRCC including recent activities, upcoming events, member spotlights, and curated industry insights.',
      tags: ['newsletter', 'monthly-update', 'hrdc-news'],
      featured: false,
    },
  ];

  for (const pub of publications) {
    await prisma.publication.create({ data: pub });
  }
  console.log(`   ✓ ${publications.length} publications created`);

  // ============================================
  // 8. TEAM MEMBERS
  // ============================================
  console.log('\n👥 Creating team members...');
  // PLACEHOLDER: Replace with actual HRDC cabinet members.
  const teamMembers = [
    // Leadership
    { name: '[President Name]', designation: 'President', department: Department.PRESIDENCY, displayOrder: 1, photo: '/images/placeholder-team.jpg', term: '2024-2025', featuredOnHomepage: true },
    { name: '[Vice President Name]', designation: 'Vice President', department: Department.PRESIDENCY, displayOrder: 2, photo: '/images/placeholder-team.jpg', term: '2024-2025', featuredOnHomepage: true },
    { name: '[General Secretary Name]', designation: 'General Secretary', department: Department.PRESIDENCY, displayOrder: 3, photo: '/images/placeholder-team.jpg', term: '2024-2025', featuredOnHomepage: true },

    // Research & Editorial Wing
    { name: '[Chief Coordinator R&E]', designation: 'Chief Coordinator', department: Department.RESEARCH_EDITORIAL, displayOrder: 4, photo: '/images/placeholder-team.jpg', term: '2024-2025', featuredOnHomepage: false },
    { name: '[Director R&E 1]', designation: 'Director', department: Department.RESEARCH_EDITORIAL, displayOrder: 5, photo: '/images/placeholder-team.jpg', term: '2024-2025', featuredOnHomepage: false },
    { name: '[Director R&E 2]', designation: 'Director', department: Department.RESEARCH_EDITORIAL, displayOrder: 6, photo: '/images/placeholder-team.jpg', term: '2024-2025', featuredOnHomepage: false },

    // Creative & Technical Wing
    { name: '[Chief Coordinator C&T]', designation: 'Chief Coordinator', department: Department.CREATIVE_TECHNICAL, displayOrder: 7, photo: '/images/placeholder-team.jpg', term: '2024-2025', featuredOnHomepage: false },
    { name: '[Director C&T 1]', designation: 'Director', department: Department.CREATIVE_TECHNICAL, displayOrder: 8, photo: '/images/placeholder-team.jpg', term: '2024-2025', featuredOnHomepage: false },

    // Project & Development Wing
    { name: '[Chief Coordinator P&D]', designation: 'Chief Coordinator', department: Department.PROJECT_DEVELOPMENT, displayOrder: 9, photo: '/images/placeholder-team.jpg', term: '2024-2025', featuredOnHomepage: false },
    { name: '[Director P&D 1]', designation: 'Director', department: Department.PROJECT_DEVELOPMENT, displayOrder: 10, photo: '/images/placeholder-team.jpg', term: '2024-2025', featuredOnHomepage: false },

    // Event Management & Corporate Communication Wing
    { name: '[Chief Coordinator EM&CC]', designation: 'Chief Coordinator', department: Department.EVENT_CORPORATE, displayOrder: 11, photo: '/images/placeholder-team.jpg', term: '2024-2025', featuredOnHomepage: false },
    { name: '[Director EM&CC 1]', designation: 'Director', department: Department.EVENT_CORPORATE, displayOrder: 12, photo: '/images/placeholder-team.jpg', term: '2024-2025', featuredOnHomepage: false },
  ];

  for (const member of teamMembers) {
    await prisma.teamMember.create({ data: member });
  }
  console.log(`   ✓ ${teamMembers.length} team members created`);

  // ============================================
  // 9. PARTNERS
  // ============================================
  console.log('\n🤝 Creating partners...');
  // PLACEHOLDER: Replace with actual HRDC partner information.
  const partners = [
    { name: '[Partner Organization 1]', logo: '/images/placeholder-partner.jpg', website: 'https://example.com', category: PartnerCategory.CORPORATE, displayOrder: 1 },
    { name: '[Partner Organization 2]', logo: '/images/placeholder-partner.jpg', website: 'https://example.com', category: PartnerCategory.ACADEMIC, displayOrder: 2 },
    { name: '[Partner Organization 3]', logo: '/images/placeholder-partner.jpg', website: 'https://example.com', category: PartnerCategory.CORPORATE, displayOrder: 3 },
    { name: '[Partner Organization 4]', logo: '/images/placeholder-partner.jpg', website: 'https://example.com', category: PartnerCategory.MEDIA, displayOrder: 4 },
    { name: '[Partner Organization 5]', logo: '/images/placeholder-partner.jpg', website: 'https://example.com', category: PartnerCategory.COMMUNITY, displayOrder: 5 },
    { name: '[Partner Organization 6]', logo: '/images/placeholder-partner.jpg', website: 'https://example.com', category: PartnerCategory.SPONSOR, displayOrder: 6 },
  ];

  for (const partner of partners) {
    await prisma.partner.create({ data: partner });
  }
  console.log(`   ✓ ${partners.length} partners created`);

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n' + '='.repeat(50));
  console.log('✅ HRDC SRCC database seeding complete!');
  console.log('='.repeat(50));
  console.log('\n📝 IMPORTANT: All content is placeholder data.');
  console.log('   Replace with verified HRDC information before production launch.');
  console.log('\n🔐 Admin Login:');
  console.log('   Email: admin@hrdc-srcc.org');
  console.log('   Password: Admin@HRDC2024');
  console.log('   ⚠️  Change this password immediately in production!\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
