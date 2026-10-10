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
      sizeBytes: result.sizeBytes
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
