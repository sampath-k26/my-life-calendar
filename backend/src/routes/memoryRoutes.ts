import { Router } from "express";
import {
  deleteMemoryMedia,
  getMemoriesForMonth,
  getMemoryByDate,
  getOnThisDayMemories,
  listMemories,
  saveMemory,
  uploadMemoryMedia,
} from "../controllers/memoryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../utils/upload.js";

const router = Router();

router.use(authMiddleware);
router.get("/", listMemories);
router.get("/month", getMemoriesForMonth);
router.get("/on-this-day", getOnThisDayMemories);
router.get("/:date", getMemoryByDate);
router.put("/:date", saveMemory);
router.post("/:id/media", upload.single("file"), uploadMemoryMedia);
router.delete("/:memoryId/media/:mediaId", deleteMemoryMedia);

export default router;
