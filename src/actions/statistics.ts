"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getStatistics() {
  return await prisma.statistic.findMany({ orderBy: { displayOrder: 'asc' } });
}

export async function createStatistic(data: any) {
  await prisma.statistic.create({ data });
  revalidatePath("/dashboard/statistics");
  revalidatePath("/");
}

export async function updateStatistic(id: string, data: any) {
  await prisma.statistic.update({ where: { id }, data });
  revalidatePath("/dashboard/statistics");
  revalidatePath("/");
}

export async function deleteStatistic(id: string) {
  await prisma.statistic.delete({ where: { id } });
  revalidatePath("/dashboard/statistics");
  revalidatePath("/");
}

export async function reorderStatistics(updates: {id: string, displayOrder: number}[]) {
  await prisma.$transaction(
    updates.map(u => prisma.statistic.update({ where: { id: u.id }, data: { displayOrder: u.displayOrder } }))
  );
  revalidatePath("/dashboard/statistics");
  revalidatePath("/");
}
