import { env } from "@/core/config/env";
import jwt from "jsonwebtoken";
import type { UserRole } from "@/shared/types/user.type";

// Durées de validité
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 jours

// * générer un token d'accès
export const generateAccessToken = (user: UserRole): string => {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

// * générer un token de rafraîchissement
export const generateRefreshToken = (user: UserRole): string => {
  return jwt.sign(
    {
      userId: user.id,
      tokenVersion: user.tokenVersion,
    },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};
