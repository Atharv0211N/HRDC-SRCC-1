'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';
import bcryptjs from 'bcryptjs';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const email = ((formData.get('email') as string) || '').trim().toLowerCase();
    const password = (formData.get('password') as string) || '';
    
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/dashboard',
    });
  } catch (error: any) {
    // Next.js redirection works by throwing a NEXT_REDIRECT error.
    // This MUST be rethrown so Next.js can complete the navigation.
    if (
      error?.digest?.startsWith?.('NEXT_REDIRECT') ||
      error?.message === 'NEXT_REDIRECT' ||
      error?.name === 'RedirectError'
    ) {
      throw error;
    }

    console.error('[authenticate error]:', error);

    // If it is an authentication error (bad password, user not found, etc.)
    if (
      error instanceof AuthError ||
      error?.name === 'AuthError' ||
      error?.type === 'CredentialsSignin' ||
      error?.message?.includes?.('CredentialsSignin')
    ) {
      return 'Invalid email or password. Please try again.';
    }

    // Never rethrow unknown errors to avoid crashing into error.tsx
    return error?.message || 'Authentication failed. Please verify credentials.';
  }
}

export async function logout() {
  await signOut();
}

export async function createUser(data: any) {
  const hashedPassword = await bcryptjs.hash(data.password, 10);
  
  return await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      passwordHash: hashedPassword,
      role: data.role || 'EDITOR',
    },
  });
}

export async function updateUserRole(userId: string, role: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: { role: role as any },
  });
}

export async function deleteUser(userId: string) {
  return await prisma.user.delete({
    where: { id: userId },
  });
}

export async function resetPassword(userId: string, newPassword: string) {
  const hashedPassword = await bcryptjs.hash(newPassword, 10);
  return await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: hashedPassword },
  });
}
