import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    fileType: { type: String, required: true },
    originalName: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const memorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: String, required: true },
    textEntry: { type: String, default: "" },
    mood: { type: String, default: "" },
    media: { type: [mediaSchema], default: [] },
  },
  { timestamps: true }
);

memorySchema.index({ userId: 1, date: 1 }, { unique: true });

export const Memory = mongoose.model("Memory", memorySchema);
