'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { publicationSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

async function createAuditLog(action: string, entityType: string, entityId: string, details?: string) {
  try {
    const session = await auth();
    if (!session || !session.user) return;
    await prisma.auditLog.create({
      data: { action, entityType, entityId, details, userId: session.user.id || ''
}
    });
  } catch (e) {}
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

export async function createPublication(data: any) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    const validatedData = publicationSchema.parse(data);
    
    const publication = await prisma.publication.create({
      data: validatedData
    });

    await createAuditLog('CREATE', 'Publication', publication.id);
    
    revalidatePath('/dashboard/publications');
    revalidatePath('/publications');
    
    return { success: true, data: publication };
  } catch (error) {
    return { success: false, error: 'Failed to create publication' };
  }
}

export async function updatePublication(id: string, data: any) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    const validatedData = publicationSchema.parse(data);
    
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
    return { success: false, error: 'Failed to update publication' };
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
