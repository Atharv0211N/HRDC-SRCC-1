export const SITE_CONFIG = {
  orgName: 'Human Resource Development Cell',
  shortName: 'HRDC',
  institution: 'Shri Ram College of Commerce',
  university: 'University of Delhi',
  founded: '2008',
  motto: 'Enable. Edify. Empower.',
  email: 'hrdc@srcc.du.ac.in',
  address: 'Shri Ram College of Commerce, University of Delhi, Maurice Nagar, Delhi - 110007',
} as const;

export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Events', href: '/events' },
  { label: 'Publications', href: '/publications' },
  { label: 'Impact', href: '/impact' },
  { label: 'Team', href: '/team' },
  { label: 'Contact', href: '/contact' },
] as const;

export const DEPARTMENTS = [
  { value: 'PRESIDENCY', label: 'Presidency' },
  { value: 'RESEARCH_EDITORIAL', label: 'Research & Editorial Wing' },
  { value: 'CREATIVE_TECHNICAL', label: 'Creative & Technical Wing' },
  { value: 'PROJECT_DEVELOPMENT', label: 'Project & Development Wing' },
  { value: 'EVENT_CORPORATE', label: 'Event Management & Corporate Communication Wing' },
] as const;

export const DEPARTMENT_LABELS: Record<string, string> = {
  PRESIDENCY: 'Presidency',
  RESEARCH_EDITORIAL: 'Research & Editorial Wing',
  CREATIVE_TECHNICAL: 'Creative & Technical Wing',
  PROJECT_DEVELOPMENT: 'Project & Development Wing',
  EVENT_CORPORATE: 'Event Management & Corporate Communication Wing',
};

export const EVENT_CATEGORY_LABELS: Record<string, string> = {
  FLAGSHIP: 'Flagship Event',
  COMPETITION: 'Competition',
  WORKSHOP: 'Workshop',
  SEMINAR: 'Seminar',
  SPEAKER_SESSION: 'Speaker Session',
  PANEL_DISCUSSION: 'Panel Discussion',
  OTHER: 'Other',
};

export const PUBLICATION_TYPE_LABELS: Record<string, string> = {
  MAGAZINE: 'Magazine',
  REPORT: 'Industry Report',
  BLOG: 'Blog',
  NEWSLETTER: 'Newsletter',
};

export const CORE_VALUES = [
  {
    title: 'Enable',
    description: 'Create opportunities for learning, leadership, and collaboration.',
  },
  {
    title: 'Edify',
    description: 'Promote knowledge through research, publications, discussion, and professional development.',
  },
  {
    title: 'Empower',
    description: 'Support individuals and communities by creating meaningful opportunities for growth and impact.',
  },
] as const;

export const CAPABILITIES = [
  {
    title: 'Research',
    description: 'In-depth exploration of HR trends, organizational behavior, and management practices.',
    icon: 'Search',
  },
  {
    title: 'Publications',
    description: 'Magazines, industry reports, blogs, and newsletters showcasing intellectual output.',
    icon: 'BookOpen',
  },
  {
    title: 'Consulting',
    description: 'Practical consulting engagements applying academic frameworks to real business challenges.',
    icon: 'Briefcase',
  },
  {
    title: 'Professional Development',
    description: 'Structured programs building essential workplace competencies and leadership capabilities.',
    icon: 'GraduationCap',
  },
  {
    title: 'Community Outreach',
    description: 'Initiatives extending HRDC\'s impact through education, mentorship, and social engagement.',
    icon: 'Heart',
  },
] as const;

export const SECTION_IDS = {
  hero: 'hero',
  impact: 'impact-dashboard',
  whatWeDo: 'what-we-do',
  projects: 'flagship-projects',
  whoWeAre: 'who-we-are',
  minductor: 'minductor',
  latestWork: 'latest-work',
  publications: 'publications-preview',
  lookingAhead: 'looking-ahead',
  insideHrdc: 'inside-hrdc',
  partners: 'partners',
  leadership: 'leadership-preview',
  contact: 'contact-cta',
} as const;
