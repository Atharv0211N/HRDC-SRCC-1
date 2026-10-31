'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { projectSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

// Helper to log admin actions
async function createAuditLog(action: string, entityType: string, entityId: string, details?: string) {
  try {
    const session = await auth();
    if (!session || !session.user) return;
    if ('auditLog' in prisma) {
      // @ts-ignore
      await prisma.auditLog.create({
        data: { action, entityType, entityId, details, userId: session.user.id || '' }
      });
    }
  } catch (e) {}
}

/** Extract plain object from FormData or pass through if already a plain object */
function extractProjectData(data: FormData | Record<string, unknown>) {
  if (!(data instanceof FormData)) return data;
  const name = (data.get('name') as string) || '';
  const rawSlug = (data.get('slug') as string) || '';
  const slug = rawSlug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const objectivesRaw = (data.get('objectives') as string) || '';
  const activitiesRaw = (data.get('activities') as string) || '';
  const galleryRaw = (data.get('gallery') as string) || '';
  return {
    name,
    slug,
    shortDescription: (data.get('shortDescription') as string) || '',
    fullDescription: (data.get('fullDescription') as string) || '',
    coverImage: (data.get('coverImage') as string) || '',
    gallery: galleryRaw ? galleryRaw.split(',').map((s) => s.trim()).filter(Boolean) : [],
    objectives: objectivesRaw ? objectivesRaw.split(',').map((s) => s.trim()).filter(Boolean) : [],
    activities: activitiesRaw ? activitiesRaw.split(',').map((s) => s.trim()).filter(Boolean) : [],
    impactSummary: (data.get('impactSummary') as string) || undefined,
    featured: data.get('featured') === 'on' || data.get('featured') === 'true',
    displayOrder: parseInt((data.get('displayOrder') as string) || '0', 10) || 0,
  };
}

export async function getProjects(includeDeleted = false) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    const projects = await prisma.project.findMany({
      where: includeDeleted ? undefined : { isDeleted: false },
      orderBy: { displayOrder: 'asc' }
    });
    return { success: true, data: projects };
  } catch (error) {
    return { success: false, error: 'Failed to fetch projects' };
  }
}

export async function createProject(data: FormData | Record<string, unknown>) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    const raw = extractProjectData(data);
    const validatedData = projectSchema.parse(raw);

    const project = await prisma.project.create({
      data: validatedData
    });

    await createAuditLog('CREATE', 'Project', project.id);

    revalidatePath('/dashboard/projects');
    revalidatePath('/projects');

    return { success: true, data: project };
  } catch (error) {
    console.error('createProject error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create project' };
  }
}

export async function updateProject(id: string, data: FormData | Record<string, unknown>) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    const raw = extractProjectData(data);
    const validatedData = projectSchema.parse(raw);

    const project = await prisma.project.update({
      where: { id },
      data: validatedData
    });

    await createAuditLog('UPDATE', 'Project', id);

    revalidatePath('/dashboard/projects');
    revalidatePath(`/dashboard/projects/${id}`);
    revalidatePath('/projects');
    revalidatePath(`/projects/${project.slug}`);

    return { success: true, data: project };
  } catch (error) {
    console.error('updateProject error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update project' };
  }
}

export async function softDeleteProject(id: string) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    await prisma.project.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() }
    });

    await createAuditLog('SOFT_DELETE', 'Project', id);

    revalidatePath('/dashboard/projects');
    revalidatePath('/projects');

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete project' };
  }
}

export async function restoreProject(id: string) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    await prisma.project.update({
      where: { id },
      data: { isDeleted: false, deletedAt: null }
    });

    await createAuditLog('RESTORE', 'Project', id);

    revalidatePath('/dashboard/projects');
    revalidatePath('/projects');

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to restore project' };
  }
}
