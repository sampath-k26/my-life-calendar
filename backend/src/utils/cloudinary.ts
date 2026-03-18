import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
});

const resourceTypeMap: Record<string, "image" | "video" | "raw"> = {
  photo: "image",
  video: "video",
  audio: "raw",
};

export const uploadFileToCloudinary = async (
  fileBuffer: Buffer,
  fileType: string,
  originalName: string
) => {
  const resourceType = resourceTypeMap[fileType] || "raw";

  return new Promise<{ secureUrl: string; publicId: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: env.cloudinaryFolder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
        filename_override: originalName,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(fileBuffer);
  });
};

export const deleteFileFromCloudinary = async (publicId: string, fileType: string) => {
  const resourceType = resourceTypeMap[fileType] || "raw";
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};
