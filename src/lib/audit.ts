import { prisma } from './prisma';
import { auth } from '@/auth';
import { Prisma } from '@prisma/client';

export async function createAuditLog(params: {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | string;
  entityType: string;
  entityId: string;
  details?: Record<string, any>;
}) {
  const session = await auth();
  if (!session?.user?.id) return;

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      details: params.details ? (params.details as Prisma.InputJsonValue) : Prisma.JsonNull,
    },
  });
}
