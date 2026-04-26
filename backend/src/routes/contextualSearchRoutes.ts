import { Router } from "express";
import { contextualSearch } from "../features/contextualSearch/contextualSearch.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);
router.post("/", contextualSearch);

export default router;
