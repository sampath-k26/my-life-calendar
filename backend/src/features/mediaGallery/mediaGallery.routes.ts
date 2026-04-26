import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { getMediaGallery } from "./mediaGallery.controller.js";

const router = Router();

router.use(authMiddleware);
router.get("/", getMediaGallery);

export default router;
