type MemoryMedia = {
  _id: { toString(): string };
  fileUrl: string;
  publicId: string;
  fileType: string;
  originalName?: string;
  createdAt: Date;
};

type MemoryRecord = {
  _id: { toString(): string };
  userId: { toString(): string };
  date: string;
  textEntry?: string;
  mood?: string;
  createdAt: Date;
  updatedAt: Date;
  media: MemoryMedia[];
};

export const formatMemory = (memory: MemoryRecord) => ({
  id: memory._id.toString(),
  userId: memory.userId.toString(),
  date: memory.date,
  textEntry: memory.textEntry || "",
  mood: memory.mood || "",
  createdAt: memory.createdAt,
  updatedAt: memory.updatedAt,
  media: (memory.media || []).map((item) => ({
    id: item._id.toString(),
    fileUrl: item.fileUrl,
    publicId: item.publicId,
    fileType: item.fileType,
    originalName: item.originalName || "",
    createdAt: item.createdAt,
  })),
});
