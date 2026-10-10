'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { createUserSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

async function createAuditLog(action: string, entityType: string, entityId: string, details?: string) {
  try {
    const session = await auth();
    if (!session || !session.user) return;
    await prisma.auditLog.create({
      data: { action, entityType, entityId, details, userId: session.user.id || '' }
    });
  } catch (e) {}
}

export async function getAdmins() {
  const session = await auth();
  if (!session || session.user.role !== 'SUPER_ADMIN') throw new Error('Unauthorized');

  try {
    const admins = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        lastLoginAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: admins };
  } catch (error) {
    return { success: false, error: 'Failed to fetch admins' };
  }
}

export async function createAdmin(data: any) {
  const session = await auth();
  if (!session || session.user.role !== 'SUPER_ADMIN') throw new Error('Unauthorized');

  try {
    const validatedData = createUserSchema.parse(data);
    
    // Check if email exists
    const existing = await prisma.user.findUnique({ where: { email: validatedData.email } });
    if (existing) {
      return { success: false, error: 'Email already in use' };
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    const admin = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        passwordHash: hashedPassword,
        role: validatedData.role as any
      },
      select: { id: true, name: true, email: true, role: true }
    });

    await createAuditLog('CREATE', 'Admin', admin.id, `Created admin with role ${admin.role}`);
    
    revalidatePath('/dashboard/admins');
    
    return { success: true, data: admin };
  } catch (error) {
    return { success: false, error: 'Failed to create admin' };
  }
}

export async function updateAdminRole(id: string, role: string) {
  const session = await auth();
  if (!session || session.user.role !== 'SUPER_ADMIN') throw new Error('Unauthorized');

  try {
    const admin = await prisma.user.update({
      where: { id },
      data: { role: role as any },
      select: { id: true, name: true, email: true, role: true }
    });

    await createAuditLog('UPDATE_ROLE', 'Admin', id, `Updated role to ${role}`);
    
    revalidatePath('/dashboard/admins');
    
    return { success: true, data: admin };
  } catch (error) {
    return { success: false, error: 'Failed to update admin role' };
  }
}

export async function deleteAdmin(id: string) {
  const session = await auth();
  if (!session || session.user.role !== 'SUPER_ADMIN') throw new Error('Unauthorized');

  // Don't allow deleting oneself
  if (session.user.id === id) {
    return { success: false, error: 'Cannot delete your own account' };
  }

  try {
    await prisma.user.delete({
      where: { id }
    });

    await createAuditLog('DELETE', 'Admin', id);
    
    revalidatePath('/dashboard/admins');
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete admin' };
  }
}

export async function resetAdminPassword(id: string, newPassword: string) {
  const session = await auth();
  if (!session || session.user.role !== 'SUPER_ADMIN') throw new Error('Unauthorized');

  try {
    if (newPassword.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { id },
      data: { passwordHash: hashedPassword }
    });

    await createAuditLog('RESET_PASSWORD', 'Admin', id);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to reset admin password' };
  }
}
