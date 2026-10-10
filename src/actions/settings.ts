"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSiteSettings() {
  let settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: {} });
  }
  return settings;
}

export async function updateSiteSettings(data: any) {
  const settings = await getSiteSettings();
  await prisma.siteSettings.update({ where: { id: settings.id }, data });
  revalidatePath("/", "layout");
}
