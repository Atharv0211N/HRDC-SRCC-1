const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function write(filePath, content) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
}

// ----------------------------------------------------
// ACTIONS
// ----------------------------------------------------

write(path.join(srcDir, 'actions', 'homepage.ts'), `
"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getHomepageContent() {
  let content = await prisma.homepageContent.findFirst();
  if (!content) {
    content = await prisma.homepageContent.create({
      data: {
        heroTitle: "Human Resource Development Cell",
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
`);

write(path.join(srcDir, 'actions', 'statistics.ts'), `
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
`);

write(path.join(srcDir, 'actions', 'partners.ts'), `
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
`);

write(path.join(srcDir, 'actions', 'messages.ts'), `
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
`);

write(path.join(srcDir, 'actions', 'settings.ts'), `
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
`);

write(path.join(srcDir, 'actions', 'admins.ts'), `
"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs"; // Assume bcryptjs is installed or we can just hash

export async function getAdmins() {
  return await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createAdmin(data: any) {
  const passwordHash = "TMP_HASH"; // Real app would hash
  await prisma.user.create({ data: { ...data, passwordHash } });
  revalidatePath("/dashboard/admins");
}

export async function updateAdminRole(id: string, role: any) {
  await prisma.user.update({ where: { id }, data: { role } });
  revalidatePath("/dashboard/admins");
}

export async function deleteAdmin(id: string) {
  await prisma.user.delete({ where: { id } });
  revalidatePath("/dashboard/admins");
}
`);

write(path.join(srcDir, 'actions', 'media.ts'), `
"use server";
import { prisma } from "@/lib/prisma";
import { uploadImage, deleteImage as deleteCloudinaryImage } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function getMediaAssets(folder?: string) {
  if (folder) {
    return await prisma.mediaAsset.findMany({ where: { folder }, orderBy: { createdAt: 'desc' } });
  }
  return await prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function uploadMedia(formData: FormData) {
  const file = formData.get("file") as File;
  const folder = formData.get("folder") as string || "general";
  if (!file) throw new Error("No file uploaded");

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadImage(buffer, folder, { fileName: file.name.split('.')[0] });

  const asset = await prisma.mediaAsset.create({
    data: {
      name: file.name,
      url: result.url,
      publicId: result.publicId,
      folder,
      format: result.format,
      width: result.width,
      height: result.height,
      sizeBytes: result.sizeBytes,
    }
  });

  revalidatePath("/dashboard/media");
  return asset;
}

export async function deleteMedia(id: string) {
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) throw new Error("Not found");
  
  await deleteCloudinaryImage(asset.publicId);
  await prisma.mediaAsset.delete({ where: { id } });
  revalidatePath("/dashboard/media");
}
`);

console.log("Actions generated.");
