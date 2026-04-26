import type mongoose from "mongoose";
import { Memory } from "../../models/Memory.js";
import { MemoryEmbedding } from "./MemoryEmbedding.js";
import { buildEmbeddingText, generateEmbedding } from "./embedding.service.js";
import { cosineSimilarity } from "./similarity.service.js";

type MemoryLike = {
  _id: mongoose.Types.ObjectId | { toString(): string };
  userId: mongoose.Types.ObjectId | { toString(): string };
  textEntry?: string;
  mood?: string;
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const syncMemoryEmbedding = async (memory: MemoryLike) => {
  const textSnapshot = buildEmbeddingText(memory.textEntry || "", memory.mood || "");
  const embedding = await generateEmbedding(textSnapshot);

  await MemoryEmbedding.findOneAndUpdate(
    { memoryId: memory._id },
    {
      $set: {
        memoryId: memory._id,
        userId: memory.userId,
        embedding,
        textSnapshot,
      },
    },
    { upsert: true, new: true }
  );
};

const ensureUserMemoryEmbeddings = async (userId: string) => {
  const memories = await Memory.find({ userId }).select("_id userId textEntry mood");
  const existingEmbeddings = await MemoryEmbedding.find({
    userId,
    memoryId: { $in: memories.map((memory) => memory._id) },
  }).select("memoryId");
  const existingMemoryIds = new Set(existingEmbeddings.map((item) => item.memoryId.toString()));
  const missingMemories = memories.filter((memory) => !existingMemoryIds.has(memory._id.toString()));

  if (!missingMemories.length) {
    return;
  }

  await Promise.all(missingMemories.map((memory) => syncMemoryEmbedding(memory)));
};

const keywordFallbackSearch = async (userId: string, query: string, limit: number) => {
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

  if (!tokens.length) {
    return [];
  }

  const regexFilters = tokens.map((token) => ({
    $or: [
      { textEntry: { $regex: escapeRegex(token), $options: "i" } },
      { mood: { $regex: escapeRegex(token), $options: "i" } },
    ],
  }));

  const memories = await Memory.find({
    userId,
    $and: regexFilters,
  })
    .select("_id date textEntry mood")
    .sort({ date: -1, updatedAt: -1 })
    .limit(limit);

  return memories.map((memory, index) => ({
    memoryId: memory._id.toString(),
    date: memory.date,
    textEntry: memory.textEntry || "",
    mood: memory.mood || "",
    score: Number((0.5 - index * 0.01).toFixed(4)),
  }));
};

export const searchMemories = async (userId: string, query: string, limit = 10) => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const safeLimit = Math.max(1, Math.min(Number(limit) || 10, 25));
  await ensureUserMemoryEmbeddings(userId);

  const queryEmbedding = await generateEmbedding(trimmedQuery);
  const embeddings = await MemoryEmbedding.find({ userId }).select("memoryId embedding");

  const ranked = embeddings
    .map((item) => ({
      memoryId: item.memoryId.toString(),
      score: cosineSimilarity(queryEmbedding, item.embedding),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, safeLimit);

  if (!ranked.length) {
    return keywordFallbackSearch(userId, trimmedQuery, safeLimit);
  }

  const memories = await Memory.find({
    _id: { $in: ranked.map((item) => item.memoryId) },
    userId,
  }).select("_id date textEntry mood");
  const memoryMap = new Map(memories.map((memory) => [memory._id.toString(), memory]));

  return ranked.flatMap((item) => {
    const memory = memoryMap.get(item.memoryId);

    if (!memory) {
      return [];
    }

    return {
      memoryId: item.memoryId,
      date: memory.date,
      textEntry: memory.textEntry || "",
      mood: memory.mood || "",
      score: Number(item.score.toFixed(4)),
    };
  });
};
