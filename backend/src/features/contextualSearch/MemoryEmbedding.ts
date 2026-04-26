import mongoose from "mongoose";

const memoryEmbeddingSchema = new mongoose.Schema(
  {
    memoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Memory", required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    embedding: { type: [Number], required: true },
    textSnapshot: { type: String, default: "" },
  },
  { timestamps: true }
);

memoryEmbeddingSchema.index({ userId: 1, memoryId: 1 });

export const MemoryEmbedding = mongoose.model("MemoryEmbedding", memoryEmbeddingSchema);
