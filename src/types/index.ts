import type {
  Project,
  Event,
  Publication,
  TeamMember,
  Statistic,
  Partner,
  ContactMessage,
  HomepageContent,
  SiteSettings,
  MediaAsset,
} from '@prisma/client';

// ============================================
// Navigation
// ============================================

export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

// ============================================
// Relations
// ============================================

export type ProjectWithRelations = Project & {
  events: Event[];
  publications: Publication[];
};

export type EventWithRelations = Event & {
  relatedProject: Project | null;
  relatedPublication: Publication | null;
};

export type PublicationWithRelations = Publication & {
  relatedProject: Project | null;
  relatedEvents: Event[];
};

// ============================================
// Dashboard
// ============================================

export interface DashboardStats {
  totalProjects: number;
  totalEvents: number;
  totalPublications: number;
  totalTeamMembers: number;
  totalPartners: number;
  totalMessages: number;
  newMessages: number;
  totalStatistics: number;
}

// ============================================
// Homepage
// ============================================

export interface HomepageData {
  content: HomepageContent | null;
  settings: SiteSettings | null;
  statistics: Statistic[];
  projects: Project[];
  latestEvents: Event[];
  latestPublications: Publication[];
  featuredTeamMembers: TeamMember[];
  partners: Partner[];
}

export interface LookingAheadItem {
  title: string;
  description: string;
}

export interface Announcement {
  text: string;
  link?: string;
  isNew?: boolean;
}

export interface Speaker {
  name: string;
  title?: string;
  organization?: string;
  photo?: string;
  linkedIn?: string;
}

// ============================================
// API Responses
// ============================================

export interface ActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// Re-exports for convenience
// ============================================

export type {
  Project,
  Event,
  Publication,
  TeamMember,
  Statistic,
  Partner,
  ContactMessage,
  HomepageContent,
  SiteSettings,
  MediaAsset,
};
