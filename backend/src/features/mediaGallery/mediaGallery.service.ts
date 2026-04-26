import { Memory } from "../../models/Memory.js";

const MEDIA_TYPES = new Set(["photo", "video", "audio"]);

export type MediaGalleryType = "photo" | "video" | "audio";

export const isMediaGalleryType = (type: unknown): type is MediaGalleryType =>
  typeof type === "string" && MEDIA_TYPES.has(type);

export const getMediaGalleryItems = async (userId: string, type: MediaGalleryType) => {
  const memories = await Memory.find({ userId, "media.fileType": type })
    .select("_id date media")
    .sort({ date: -1 });

  return memories.flatMap((memory) =>
    memory.media
      .filter((item) => item.fileType === type)
      .map((item) => ({
        memoryId: memory._id.toString(),
        date: memory.date,
        url: item.fileUrl,
        type: item.fileType,
        originalName: item.originalName || "",
        createdAt: item.createdAt,
      }))
  ).sort((a, b) => {
    if (a.date !== b.date) {
      return b.date.localeCompare(a.date);
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};
