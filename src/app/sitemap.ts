import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hrdc-srcc.org';
  
  // Static pages
  const staticPages = ['', '/about', '/projects', '/events', '/publications', '/impact', '/team', '/contact'];
  
  try {
    // Dynamic pages from database
    const projects = await prisma.project.findMany({ where: { isDeleted: false }, select: { slug: true, updatedAt: true } });
    const events = await prisma.event.findMany({ where: { isDeleted: false }, select: { slug: true, updatedAt: true } });
    const publications = await prisma.publication.findMany({ where: { isDeleted: false }, select: { slug: true, updatedAt: true } });
    
    return [
      ...staticPages.map(path => ({ url: `${baseUrl}${path}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: path === '' ? 1.0 : 0.8 })),
      ...projects.map(p => ({ url: `${baseUrl}/projects/${p.slug}`, lastModified: p.updatedAt, changeFrequency: 'monthly' as const, priority: 0.7 })),
      ...events.map(e => ({ url: `${baseUrl}/events/${e.slug}`, lastModified: e.updatedAt, changeFrequency: 'monthly' as const, priority: 0.6 })),
      ...publications.map(pub => ({ url: `${baseUrl}/publications/${pub.slug}`, lastModified: pub.updatedAt, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ];
  } catch (error) {
    // Fallback if database is unreachable at build time
    return staticPages.map(path => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1.0 : 0.8,
    }));
  }
}
