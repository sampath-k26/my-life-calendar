import type express from "express";
import type { AuthRequest } from "../../types/auth.js";
import { getMediaGalleryItems, isMediaGalleryType } from "./mediaGallery.service.js";

export const getMediaGallery = async (req: AuthRequest, res: express.Response) => {
  const type = req.query.type || "photo";

  if (!isMediaGalleryType(type)) {
    return res.status(400).json({ message: "Valid media type is required" });
  }

  const items = await getMediaGalleryItems(req.userId, type);
  return res.json(items);
};
