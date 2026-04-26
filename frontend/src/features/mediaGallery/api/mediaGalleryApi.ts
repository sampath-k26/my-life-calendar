import { apiRequest } from "@/lib/api";

export type MediaGalleryType = "photo" | "video" | "audio";

export interface MediaGalleryItem {
  memoryId: string;
  date: string;
  url: string;
  type: MediaGalleryType;
  originalName: string;
  createdAt: string;
}

export const fetchMediaGallery = (type: MediaGalleryType) =>
  apiRequest<MediaGalleryItem[]>(`/api/media-gallery?type=${type}`);
