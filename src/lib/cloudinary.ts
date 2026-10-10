import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  sizeBytes: number;
}

export async function uploadImage(
  fileBuffer: Buffer,
  folder: string = 'general',
  options?: { fileName?: string }
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `hrdc-srcc/${folder}`,
        resource_type: 'auto',
        public_id: options?.fileName,
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          sizeBytes: result.bytes,
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export function getOptimizedUrl(
  publicId: string,
  options?: { width?: number; height?: number; crop?: string }
): string {
  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      {
        quality: 'auto',
        fetch_format: 'auto',
        width: options?.width,
        height: options?.height,
        crop: options?.crop || 'fill',
        gravity: 'auto',
      },
    ],
  });
}

export async function uploadPdf(
  fileBuffer: Buffer,
  folder: string = 'publications',
  options?: { fileName?: string }
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `hrdc-srcc/${folder}`,
        resource_type: 'raw',
        public_id: options?.fileName,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: 0,
          height: 0,
          format: result.format || 'pdf',
          sizeBytes: result.bytes,
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
}
