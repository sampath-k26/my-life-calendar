import type express from "express";

export type AuthRequest = express.Request & {
  userId?: string;
};
