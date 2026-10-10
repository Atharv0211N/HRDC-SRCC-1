import { z } from 'zod';

// ============================================
// Public Form Schemas
// ============================================

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  organization: z.string().optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// ============================================
// Auth Schemas
// ============================================

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const createUserSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR']),
});

// ============================================
// Dashboard Schemas
// ============================================

export const teamMemberSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  designation: z.string().min(2, 'Designation is required'),
  department: z.enum(['PRESIDENCY', 'RESEARCH_EDITORIAL', 'CREATIVE_TECHNICAL', 'PROJECT_DEVELOPMENT', 'EVENT_CORPORATE']),
  photo: z.string().url('Please provide a valid image URL'),
  linkedIn: z.string().url('Please provide a valid LinkedIn URL').optional().or(z.literal('')),
  term: z.string().min(4, 'Term is required (e.g., 2024-2025)'),
  displayOrder: z.number().int().min(0).default(0),
  featuredOnHomepage: z.boolean().default(false),
});

export const projectSchema = z.object({
  name: z.string().min(2, 'Project name is required'),
  slug: z.string().min(2, 'Slug is required'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters'),
  fullDescription: z.string().min(50, 'Full description must be at least 50 characters'),
  coverImage: z.string().url('Please provide a valid image URL'),
  gallery: z.array(z.string().url()).default([]),
  objectives: z.array(z.string()).default([]),
  activities: z.array(z.string()).default([]),
  impactSummary: z.string().optional(),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
});

export const eventSchema = z.object({
  title: z.string().min(3, 'Event title is required'),
  slug: z.string().min(2, 'Slug is required'),
  date: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  category: z.enum(['FLAGSHIP', 'COMPETITION', 'WORKSHOP', 'SEMINAR', 'SPEAKER_SESSION', 'PANEL_DISCUSSION', 'OTHER']),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  heroImage: z.string().url('Please provide a valid image URL'),
  gallery: z.array(z.string().url()).default([]),
  speakers: z.any().optional(),
  highlights: z.array(z.string()).default([]),
  venue: z.string().optional(),
  relatedProjectId: z.string().optional(),
  relatedPublicationId: z.string().optional(),
  featured: z.boolean().default(false),
  archived: z.boolean().default(false),
});

export const publicationSchema = z.object({
  title: z.string().min(3, 'Publication title is required'),
  slug: z.string().min(2, 'Slug is required'),
  type: z.enum(['MAGAZINE', 'REPORT', 'BLOG', 'NEWSLETTER']),
  date: z.coerce.date(),
  coverImage: z.string().url('Please provide a valid image URL'),
  summary: z.string().min(20, 'Summary must be at least 20 characters'),
  content: z.string().optional(),
  pdfUrl: z.string().url().optional().or(z.literal('')),
  externalLink: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  relatedProjectId: z.string().optional(),
});

export const statisticSchema = z.object({
  label: z.string().min(2, 'Label is required'),
  value: z.string().min(1, 'Value is required'),
  description: z.string().optional(),
  displayOrder: z.number().int().min(0).default(0),
});

export const partnerSchema = z.object({
  name: z.string().min(2, 'Partner name is required'),
  logo: z.string().url('Please provide a valid logo URL'),
  website: z.string().url('Please provide a valid website URL').optional().or(z.literal('')),
  category: z.enum(['CORPORATE', 'ACADEMIC', 'MEDIA', 'COMMUNITY', 'SPONSOR', 'OTHER']),
  displayOrder: z.number().int().min(0).default(0),
});

export const siteSettingsSchema = z.object({
  orgName: z.string().min(2),
  institution: z.string().min(2),
  founded: z.string(),
  motto: z.string().optional(),
  primaryEmail: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  linkedIn: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  recruitmentOpen: z.boolean(),
  recruitmentFormUrl: z.string().url().optional().or(z.literal('')),
  defaultSeoTitle: z.string().optional(),
  defaultSeoDescription: z.string().optional(),
  defaultSeoImage: z.string().optional(),
  announcementBannerText: z.string().optional(),
  announcementBannerLink: z.string().optional(),
  announcementBannerEnabled: z.boolean(),
});

export const homepageContentSchema = z.object({
  heroTitle: z.string().min(5),
  heroSubtitle: z.string().optional(),
  heroCtaText: z.string().optional(),
  heroCtaLink: z.string().optional(),
  heroSecondaryCtaText: z.string().optional(),
  heroSecondaryCtaLink: z.string().optional(),
  heroImage: z.string().optional(),
  lookingAheadTitle: z.string().optional(),
  lookingAheadDescription: z.string().optional(),
  lookingAheadItems: z.any().optional(),
  announcements: z.any().optional(),
});
