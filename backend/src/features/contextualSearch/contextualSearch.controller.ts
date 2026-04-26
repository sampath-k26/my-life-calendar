import type express from "express";
import type { AuthRequest } from "../../types/auth.js";
import { searchMemories } from "./contextualSearch.service.js";

export const contextualSearch = async (req: AuthRequest, res: express.Response) => {
  const { query, limit } = req.body ?? {};

  if (typeof query !== "string") {
    return res.status(400).json({ message: "Query is required" });
  }

  const results = await searchMemories(req.userId, query, limit);
  return res.json(results);
};
