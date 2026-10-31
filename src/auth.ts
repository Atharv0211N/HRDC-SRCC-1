import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'hrdc-srcc-super-secret-jwt-key-2024-production',
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const email = (credentials.email as string).trim().toLowerCase();
          const password = credentials.password as string;

          const user = await prisma.user.findFirst({
            where: {
              email: {
                equals: email,
                mode: 'insensitive',
              },
            },
          });

          if (!user || !user.passwordHash) {
            console.warn(`[auth] User not found or no password hash for email: ${email}`);
            return null;
          }

          const passwordsMatch = await bcryptjs.compare(password, user.passwordHash);

          if (passwordsMatch) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }

          console.warn(`[auth] Invalid password for email: ${email}`);
          return null;
        } catch (error) {
          console.error('[auth] Authorize exception:', error);
          return null;
        }
      },
    }),
  ],
});
