"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMessages() {
  return await prisma.contactMessage.findMany({ orderBy: { submittedAt: 'desc' } });
}

export async function updateMessageStatus(id: string, status: any) {
  await prisma.contactMessage.update({ where: { id }, data: { status } });
  revalidatePath("/dashboard/messages");
}

export async function deleteMessage(id: string) {
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/dashboard/messages");
}
