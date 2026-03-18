import type express from "express";
import { Memory } from "../models/Memory.js";
import type { AuthRequest } from "../types/auth.js";
import { deleteFileFromCloudinary, uploadFileToCloudinary } from "../utils/cloudinary.js";
import { formatMemory } from "../utils/memoryFormatter.js";

export const listMemories = async (req: AuthRequest, res: express.Response) => {
  const memories = await Memory.find({ userId: req.userId }).sort({ date: -1, updatedAt: -1 });
  return res.json(memories.map((memory) => formatMemory(memory)));
};

export const getMemoriesForMonth = async (req: AuthRequest, res: express.Response) => {
  const year = Number(req.query.year);
  const month = Number(req.query.month);

  if (Number.isNaN(year) || Number.isNaN(month) || month < 0 || month > 11) {
    return res.status(400).json({ message: "Valid year and month are required" });
  }

  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const endDate = `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-01`;

  const memories = await Memory.find({
    userId: req.userId,
    date: { $gte: startDate, $lt: endDate },
  }).select("_id date mood");

  return res.json(
    memories.map((memory) => ({
      id: memory._id.toString(),
      date: memory.date,
      mood: memory.mood || "",
    }))
  );
};

export const getOnThisDayMemories = async (req: AuthRequest, res: express.Response) => {
  const today = new Date().toISOString().slice(5, 10);
  const todayFullDate = new Date().toISOString().slice(0, 10);

  const memories = await Memory.find({
    userId: req.userId,
    date: { $regex: `-${today}$` },
  }).sort({ date: -1 });

  return res.json(
    memories
      .filter((memory) => memory.date !== todayFullDate)
      .map((memory) => formatMemory(memory))
  );
};

export const getMemoryByDate = async (req: AuthRequest, res: express.Response) => {
  const memory = await Memory.findOne({ userId: req.userId, date: req.params.date });
  if (!memory) {
    return res.json(null);
  }

  return res.json(formatMemory(memory));
};

export const saveMemory = async (req: AuthRequest, res: express.Response) => {
  const { textEntry, mood } = req.body ?? {};
  const update: Record<string, unknown> = {};

  if (textEntry !== undefined) update.textEntry = String(textEntry);
  if (mood !== undefined) update.mood = String(mood);

  const memory = await Memory.findOneAndUpdate(
    { userId: req.userId, date: req.params.date },
    {
      $set: update,
      $setOnInsert: { userId: req.userId, date: req.params.date, media: [] },
    },
    { new: true, upsert: true }
  );

  return res.json(formatMemory(memory));
};

export const uploadMemoryMedia = async (req: AuthRequest, res: express.Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "A file is required" });
  }

  const memory = await Memory.findOne({ _id: req.params.id, userId: req.userId });
  if (!memory) {
    return res.status(404).json({ message: "Memory not found" });
  }

  const mediaType = String(req.body.fileType || "photo");
  const uploadedFile = await uploadFileToCloudinary(req.file.buffer, mediaType, req.file.originalname);
  memory.media.push({
    fileUrl: uploadedFile.secureUrl,
    publicId: uploadedFile.publicId,
    fileType: mediaType,
    originalName: req.file.originalname,
  });
  await memory.save();

  const addedMedia = memory.media[memory.media.length - 1];
  return res.status(201).json({
    id: addedMedia._id.toString(),
    fileUrl: addedMedia.fileUrl,
    publicId: addedMedia.publicId,
    fileType: addedMedia.fileType,
    originalName: addedMedia.originalName || "",
    createdAt: addedMedia.createdAt,
  });
};

export const deleteMemoryMedia = async (req: AuthRequest, res: express.Response) => {
  const memory = await Memory.findOne({ _id: req.params.memoryId, userId: req.userId });
  if (!memory) {
    return res.status(404).json({ message: "Memory not found" });
  }

  const mediaItem = memory.media.id(req.params.mediaId);
  if (!mediaItem) {
    return res.status(404).json({ message: "Media not found" });
  }

  await deleteFileFromCloudinary(mediaItem.publicId, mediaItem.fileType);

  mediaItem.deleteOne();
  await memory.save();

  return res.json({ success: true });
};
