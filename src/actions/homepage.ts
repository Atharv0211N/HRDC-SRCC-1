"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getHomepageContent() {
  let content = await prisma.homepageContent.findFirst();
  if (!content) {
    content = await prisma.homepageContent.create({
      data: {
        heroTitle: "Human Resource Development Cell"
}
    });
  }
  return content;
}

export async function updateHomepageContent(data: any) {
  const content = await getHomepageContent();
  await prisma.homepageContent.update({
    where: { id: content.id },
    data
  });
  revalidatePath("/");
  revalidatePath("/dashboard/homepage");
}
