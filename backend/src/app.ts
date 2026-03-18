import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import memoryRoutes from "./routes/memoryRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

const app = express();
const allowedLocalOrigins = new Set([
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  ...env.clientOrigins,
]);

const isAllowedOrigin = (origin: string) => {
  if (allowedLocalOrigins.has(origin)) {
    return true;
  }

  try {
    const url = new URL(origin);
    const isHttp = url.protocol === "http:" || url.protocol === "https:";
    const isFrontendPort = url.port === "8080";
    const isIpv4 = /^\d{1,3}(\.\d{1,3}){3}$/.test(url.hostname);
    return isHttp && isFrontendPort && isIpv4;
  } catch {
    return false;
  }
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS blocked for this origin"));
    },
    credentials: false,
  })
);
app.use(express.json({ limit: "10mb" }));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/memories", memoryRoutes);

export default app;
