'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { projectSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Helper to log admin actions
async function createAuditLog(action: string, entityType: string, entityId: string, details?: string) {
  try {
    const session = await auth();
    if (!session || !session.user) return;
    if ('auditLog' in prisma) {
      // @ts-ignore
      await prisma.auditLog.create({
        data: { action, entityType, entityId, details, userId: session.user.id || ''
}
      });
    }
  } catch (e) {}
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

export async function createProject(data: any) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    const validatedData = projectSchema.parse(data);
    
    const project = await prisma.project.create({
      data: validatedData
    });

    await createAuditLog('CREATE', 'Project', project.id);
    
    revalidatePath('/dashboard/projects');
    revalidatePath('/projects');
    
    return { success: true, data: project };
  } catch (error) {
    return { success: false, error: 'Failed to create project' };
  }
}

export async function updateProject(id: string, data: any) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    const validatedData = projectSchema.parse(data);
    
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
    return { success: false, error: 'Failed to update project' };
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
