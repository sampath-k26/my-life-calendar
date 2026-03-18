import bcrypt from "bcryptjs";
import type express from "express";
import { User } from "../models/User.js";
import { signToken } from "../utils/token.js";
import type { AuthRequest } from "../types/auth.js";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { name = "", email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const normalizedEmail = String(email).toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      name: String(name),
      email: normalizedEmail,
      passwordHash,
    });

    return res.status(201).json({
      token: signToken(user._id.toString()),
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not create account", error });
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body ?? {};
    const normalizedEmail = String(email).toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(String(password), user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      token: signToken(user._id.toString()),
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not log in", error });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: express.Response) => {
  const user = await User.findById(req.userId).select("_id name email");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
  });
};

