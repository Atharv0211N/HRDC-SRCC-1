"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPartners() {
  return await prisma.partner.findMany({ orderBy: { displayOrder: 'asc' } });
}

export async function createPartner(data: any) {
  await prisma.partner.create({ data });
  revalidatePath("/dashboard/partners");
  revalidatePath("/");
}

export async function updatePartner(id: string, data: any) {
  await prisma.partner.update({ where: { id }, data });
  revalidatePath("/dashboard/partners");
  revalidatePath("/");
}

export async function deletePartner(id: string) {
  await prisma.partner.delete({ where: { id } });
  revalidatePath("/dashboard/partners");
  revalidatePath("/");
}
