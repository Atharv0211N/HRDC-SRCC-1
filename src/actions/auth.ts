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
    await signIn('credentials', Object.fromEntries(formData));
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
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
      role: data.role || 'EDITOR'
}
});
}

export async function updateUserRole(userId: string, role: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: { role: role as any }
});
}

export async function deleteUser(userId: string) {
  return await prisma.user.delete({
    where: { id: userId }
});
}

export async function resetPassword(userId: string, newPassword: string) {
  const hashedPassword = await bcryptjs.hash(newPassword, 10);
  return await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: hashedPassword }
});
}
