'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { eventSchema } from '@/lib/validations';
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

export async function getEvents(includeDeleted = false) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    const events = await prisma.event.findMany({
      where: includeDeleted ? undefined : { isDeleted: false },
      orderBy: { date: 'desc' }
    });
    return { success: true, data: events };
  } catch (error) {
    return { success: false, error: 'Failed to fetch events' };
  }
}

export async function createEvent(data: any) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    const validatedData = eventSchema.parse(data);
    
    const event = await prisma.event.create({
      data: validatedData
    });

    await createAuditLog('CREATE', 'Event', event.id);
    
    revalidatePath('/dashboard/events');
    revalidatePath('/events');
    
    return { success: true, data: event };
  } catch (error) {
    return { success: false, error: 'Failed to create event' };
  }
}

export async function updateEvent(id: string, data: any) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    const validatedData = eventSchema.parse(data);
    
    const event = await prisma.event.update({
      where: { id },
      data: validatedData
    });

    await createAuditLog('UPDATE', 'Event', id);
    
    revalidatePath('/dashboard/events');
    revalidatePath(`/dashboard/events/${id}`);
    revalidatePath('/events');
    revalidatePath(`/events/${event.slug}`);
    
    return { success: true, data: event };
  } catch (error) {
    return { success: false, error: 'Failed to update event' };
  }
}

export async function softDeleteEvent(id: string) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    await prisma.event.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() }
    });

    await createAuditLog('SOFT_DELETE', 'Event', id);
    
    revalidatePath('/dashboard/events');
    revalidatePath('/events');
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete event' };
  }
}

export async function archiveEvent(id: string, archived: boolean) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    await prisma.event.update({
      where: { id },
      data: { archived }
    });

    await createAuditLog('ARCHIVE_STATUS_CHANGE', 'Event', id, `Archived: ${archived}`);
    
    revalidatePath('/dashboard/events');
    revalidatePath('/events');
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update archive status' };
  }
}

export async function restoreEvent(id: string) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    await prisma.event.update({
      where: { id },
      data: { isDeleted: false, deletedAt: null }
    });

    await createAuditLog('RESTORE', 'Event', id);
    
    revalidatePath('/dashboard/events');
    revalidatePath('/events');
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to restore event' };
  }
}
