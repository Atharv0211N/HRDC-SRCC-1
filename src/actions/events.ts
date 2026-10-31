'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { eventSchema } from '@/lib/validations';
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
function extractEventData(data: FormData | Record<string, unknown>) {
  if (!(data instanceof FormData)) return data;
  const name = (data.get('title') as string) || '';
  const rawSlug = (data.get('slug') as string) || '';
  const slug = rawSlug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const highlightsRaw = (data.get('highlights') as string) || '';
  const galleryRaw = (data.get('gallery') as string) || '';
  const endDateRaw = (data.get('endDate') as string) || '';
  return {
    title: name,
    slug,
    date: (data.get('date') as string) || new Date().toISOString(),
    endDate: endDateRaw || undefined,
    category: (data.get('category') as string) || 'OTHER',
    description: (data.get('description') as string) || '',
    heroImage: (data.get('heroImage') as string) || '',
    gallery: galleryRaw ? galleryRaw.split(',').map((s) => s.trim()).filter(Boolean) : [],
    highlights: highlightsRaw ? highlightsRaw.split(',').map((s) => s.trim()).filter(Boolean) : [],
    venue: (data.get('venue') as string) || undefined,
    relatedProjectId: (data.get('relatedProjectId') as string) || undefined,
    relatedPublicationId: (data.get('relatedPublicationId') as string) || undefined,
    featured: data.get('featured') === 'on' || data.get('featured') === 'true',
    archived: data.get('archived') === 'on' || data.get('archived') === 'true',
  };
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

export async function createEvent(data: FormData | Record<string, unknown>) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    const raw = extractEventData(data);
    const validatedData = eventSchema.parse(raw);

    const event = await prisma.event.create({
      data: validatedData
    });

    await createAuditLog('CREATE', 'Event', event.id);

    revalidatePath('/dashboard/events');
    revalidatePath('/events');

    return { success: true, data: event };
  } catch (error) {
    console.error('createEvent error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create event' };
  }
}

export async function updateEvent(id: string, data: FormData | Record<string, unknown>) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    const raw = extractEventData(data);
    const validatedData = eventSchema.parse(raw);

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
    console.error('updateEvent error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update event' };
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
