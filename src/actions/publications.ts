'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { publicationSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

async function createAuditLog(action: string, entityType: string, entityId: string, details?: string) {
  try {
    const session = await auth();
    if (!session || !session.user) return;
    await prisma.auditLog.create({
      data: { action, entityType, entityId, details, userId: session.user.id || '' }
    });
  } catch (e) {}
}

/** Extract plain object from FormData or pass through if already a plain object */
function extractPublicationData(data: FormData | Record<string, unknown>) {
  if (!(data instanceof FormData)) return data;
  const title = (data.get('title') as string) || '';
  const rawSlug = (data.get('slug') as string) || '';
  const slug = rawSlug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const tagsRaw = (data.get('tags') as string) || '';
  return {
    title,
    slug,
    type: (data.get('type') as string) || 'BLOG',
    date: (data.get('date') as string) || new Date().toISOString(),
    coverImage: (data.get('coverImage') as string) || '',
    summary: (data.get('summary') as string) || '',
    content: (data.get('content') as string) || undefined,
    pdfUrl: (data.get('pdfUrl') as string) || undefined,
    externalLink: (data.get('externalLink') as string) || undefined,
    tags: tagsRaw ? tagsRaw.split(',').map((s) => s.trim()).filter(Boolean) : [],
    featured: data.get('featured') === 'on' || data.get('featured') === 'true',
    relatedProjectId: (data.get('relatedProjectId') as string) || undefined,
  };
}

export async function getPublications(includeDeleted = false) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    const publications = await prisma.publication.findMany({
      where: includeDeleted ? undefined : { isDeleted: false },
      orderBy: { date: 'desc' }
    });
    return { success: true, data: publications };
  } catch (error) {
    return { success: false, error: 'Failed to fetch publications' };
  }
}

export async function createPublication(data: FormData | Record<string, unknown>) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    const raw = extractPublicationData(data);
    const validatedData = publicationSchema.parse(raw);

    const publication = await prisma.publication.create({
      data: validatedData
    });

    await createAuditLog('CREATE', 'Publication', publication.id);

    revalidatePath('/dashboard/publications');
    revalidatePath('/publications');

    return { success: true, data: publication };
  } catch (error) {
    console.error('createPublication error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create publication' };
  }
}

export async function updatePublication(id: string, data: FormData | Record<string, unknown>) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    const raw = extractPublicationData(data);
    const validatedData = publicationSchema.parse(raw);

    const publication = await prisma.publication.update({
      where: { id },
      data: validatedData
    });

    await createAuditLog('UPDATE', 'Publication', id);

    revalidatePath('/dashboard/publications');
    revalidatePath(`/dashboard/publications/${id}`);
    revalidatePath('/publications');
    revalidatePath(`/publications/${publication.slug}`);

    return { success: true, data: publication };
  } catch (error) {
    console.error('updatePublication error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update publication' };
  }
}

export async function softDeletePublication(id: string) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    await prisma.publication.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() }
    });

    await createAuditLog('SOFT_DELETE', 'Publication', id);

    revalidatePath('/dashboard/publications');
    revalidatePath('/publications');

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete publication' };
  }
}

export async function restorePublication(id: string) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    await prisma.publication.update({
      where: { id },
      data: { isDeleted: false, deletedAt: null }
    });

    await createAuditLog('RESTORE', 'Publication', id);

    revalidatePath('/dashboard/publications');
    revalidatePath('/publications');

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to restore publication' };
  }
}
