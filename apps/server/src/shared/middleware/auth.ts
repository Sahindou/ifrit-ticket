import jwt from "jsonwebtoken";
import { env } from "@/core/config/env";
import { Request, Response, NextFunction } from "express";
import { CustomJwtPayload } from "@/shared/types/express";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  // récupérer le token depuis les cookies
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Accès non autorisé" });
  }

  jwt.verify(
    token,
    env.ACCESS_TOKEN_SECRET,
    (
      err: jwt.VerifyErrors | null,
      decoded: string | jwt.JwtPayload | undefined
    ) => {
      if (err) {
        return res.status(403).json({ message: "Token invalide ou expiré" });
      }

      req.user = decoded as CustomJwtPayload;
      next();
    }
  );
};

export const authorizeRole = (roles: string[]) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void | Response => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Utilisateur non authentifié'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Accès refusé - privilèges insuffisants'
      });
    }
    next();
  };
};
