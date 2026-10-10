'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { teamMemberSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Helper to log admin actions
async function createAuditLog(action: string, entityType: string, entityId: string, details?: string) {
  try {
    const session = await auth();
    if (!session || !session.user) return;
    
    // Check if AuditLog model exists before trying to write to it
    if ('auditLog' in prisma) {
      // @ts-ignore
      await prisma.auditLog.create({
        data: {
          action,
          entityType,
          entityId,
          details,
          userId: session.user.id || ''
}
      });
    }
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}

export async function getTeamMembers() {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { displayOrder: 'asc' }
    });
    return { success: true, data: members };
  } catch (error) {
    return { success: false, error: 'Failed to fetch team members' };
  }
}

export async function createTeamMember(data: any) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    const validatedData = teamMemberSchema.parse(data);
    
    const member = await prisma.teamMember.create({
      data: validatedData
    });

    await createAuditLog('CREATE', 'TeamMember', member.id);
    
    revalidatePath('/dashboard/team');
    revalidatePath('/team');
    
    return { success: true, data: member };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to create team member' };
  }
}

export async function updateTeamMember(id: string, data: any) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    const validatedData = teamMemberSchema.parse(data);
    
    const member = await prisma.teamMember.update({
      where: { id },
      data: validatedData
    });

    await createAuditLog('UPDATE', 'TeamMember', id);
    
    revalidatePath('/dashboard/team');
    revalidatePath('/team');
    
    return { success: true, data: member };
  } catch (error) {
    return { success: false, error: 'Failed to update team member' };
  }
}

export async function deleteTeamMember(id: string) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    await prisma.teamMember.delete({
      where: { id }
    });

    await createAuditLog('DELETE', 'TeamMember', id);
    
    revalidatePath('/dashboard/team');
    revalidatePath('/team');
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete team member' };
  }
}

export async function reorderTeamMembers(orderedIds: string[]) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  try {
    // Run all updates in a transaction
    await prisma.$transaction(
      orderedIds.map((id, index) => 
        prisma.teamMember.update({
          where: { id },
          data: { displayOrder: index }
        })
      )
    );

    await createAuditLog('REORDER', 'TeamMember', 'multiple');
    
    revalidatePath('/dashboard/team');
    revalidatePath('/team');
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to reorder team members' };
  }
}
