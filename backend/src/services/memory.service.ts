import { detectMood } from "../features/moodDetection/moodDetection.service.js";
import { syncMemoryEmbedding } from "../features/contextualSearch/contextualSearch.service.js";
import { Memory } from "../models/Memory.js";

export const saveMemoryForDate = async ({
  userId,
  date,
  textEntry,
}: {
  userId: string;
  date: string;
  textEntry?: unknown;
}) => {
  const update: Record<string, unknown> = {};

  if (textEntry !== undefined) {
    const normalizedTextEntry = String(textEntry);
    update.textEntry = normalizedTextEntry;
    update.mood = detectMood(normalizedTextEntry);
  }

  const updateOperation: Record<string, unknown> = {
    $setOnInsert: { userId, date, media: [] },
  };

  if (Object.keys(update).length > 0) {
    updateOperation.$set = update;
  }

  const memory = await Memory.findOneAndUpdate(
    { userId, date },
    updateOperation,
    { new: true, upsert: true }
  );

  void syncMemoryEmbedding(memory).catch((error) => {
    console.error("Failed to sync memory embedding:", error);
  });

  return memory;
};
