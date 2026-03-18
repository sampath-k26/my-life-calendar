import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  host: process.env.HOST || "0.0.0.0",
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/life-calendar",
  jwtSecret: process.env.JWT_SECRET || "change-me-in-env",
  clientOrigins: (process.env.CLIENT_ORIGIN || "http://localhost:8080")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  allowVercelOrigins: process.env.ALLOW_VERCEL_ORIGINS !== "false",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
  cloudinaryFolder: process.env.CLOUDINARY_FOLDER || "life-calendar",
};
