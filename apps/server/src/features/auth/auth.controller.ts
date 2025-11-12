import { Request, Response } from "express";
import { APIError, APIResponse, APICookie, logger } from "@/shared/utils";
import { usersModel } from "../users/user.model";
import bcrypt from "bcrypt";
import { loginValidation, registerValidation } from "./auth.zod";
import { generateAccessToken, generateRefreshToken } from "./auth.utils";
import jwt from "jsonwebtoken";
import { env } from "@/core/config/env";


const refreshTokens = new Set<string>();

export const authController = {
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = loginValidation.parse(req.body);

      // Validation
      if (!email || !password) {
        return APIError(res, 400, "Email and password are required");
      }

      // Trouver l'utilisateur
      const user = await usersModel.findUserByEmail(email);
      if (!user) {
        return APIError(res, 401, "Invalid credentials");
      }

      // Vérifier le mot de passe
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return APIError(res, 401, "Invalid credentials");
      }

      // Générer les tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Stocker le refresh token
      refreshTokens.add(refreshToken);

      // Envoyer les tokens dans des cookies HTTP-only
      APICookie(res, "accessToken", accessToken, 15 * 60 * 1000); // 15 minutes

      APICookie(
        res,
        "refreshToken",
        refreshToken,
        7 * 24 * 60 * 60 * 1000,
        "/api/auth/refresh"
      ); // 7 jours

      return APIResponse(res, user, "Login successful");
    } catch (error) {
      logger.error("Login error:", error);
      return APIError(res, 500, "Erreur serveur", error);
    }
  },
  register: async (req: Request, res: Response) => {
    try {
      const { email, password, pseudo } = registerValidation.parse(req.body);

      // validation
      if (!email || !password || !pseudo) {
        return APIError(res, 400, "Email, password and pseudo are required");
      }

      const existingUser = await usersModel.findUserByEmail(email);

      if (existingUser) {
        return APIError(res, 401, "Cet email est déjà utilisé");
      }

      // Hash du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer l'utilisateur
      const newUser = {
        email,
        password: hashedPassword,
        pseudo,
        role: "USER" as const,
        tokenVersion: 0,
      };

      const createdUser = await usersModel.register(newUser);

      // Générer les tokens
      const accessToken = generateAccessToken(createdUser);
      const refreshToken = generateRefreshToken(createdUser);

      // Stocker le refresh token
      refreshTokens.add(refreshToken);

      // Envoyer les tokens dans des cookies HTTP-only
      APICookie(res, "accessToken", accessToken, 15 * 60 * 1000); // 15 minutes
      APICookie(
        res,
        "refreshToken",
        refreshToken,
        7 * 24 * 60 * 60 * 1000,
        "/api/auth/refresh"
      ); // 7 jours

      return APIResponse(res, createdUser, "User registered successfully", 201);
    } catch (error) {
      console.error("Registration error:", error);
      return APIError(res, 500, "Internal server error", error);
    }
  },
  refreshToken: async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return APIError(res, 401, "Refresh token manquant");
    }

    if (!refreshTokens.has(refreshToken)) {
      return APIError(res, 403, "Refresh token invalide");
    }

    // vérifier la validité du token
    jwt.verify(
      refreshToken,
      env.REFRESH_TOKEN_SECRET,
      async (err: jwt.VerifyErrors | null, decoded: any) => {
        if (err) {
          return APIError(res, 403, "Refresh token invalide ou expiré");
        }

        // trouver l'utilisateur
        const user = await usersModel.findUserById(decoded.userId);

        if (!user) {
          return APIError(res, 404, "Utilisateur non trouvé");
        }

        if (decoded.tokenVersion !== user.tokenVersion) {
          refreshTokens.delete(refreshToken);
          return APIError(res, 403, "Refresh token invalide");
        }

        // Générer un nouveau access token
        const newAccessToken = generateAccessToken(user);

        // Optionnel: Rotation du refresh token (plus sécurisé)
        const newRefreshToken = generateRefreshToken(user);
        refreshTokens.delete(refreshToken); // Supprimer l'ancien
        refreshTokens.add(newRefreshToken); // Ajouter le nouveau

        // Envoyer le nouveau token dans un cookie
        APICookie(res, "accessToken", newAccessToken, 15 * 60 * 1000);
        APICookie(
          res,
          "refreshToken",
          newRefreshToken,
          7 * 24 * 60 * 60 * 1000,
          "/api/auth/refresh"
        );

        return APIResponse(
          res,
          { accessToken: newAccessToken },
          "Token rafraîchi avec succès"
        );
      }
    );
  },
  logout: async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    // Supprimer le refresh token de la liste
    if (refreshToken) {
      refreshTokens.delete(refreshToken);
    }

    // Supprimer les cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken", { path: "/api/auth/refresh" });

    return APIResponse(res, null, "Déconnexion réussie");
  },
  me: async (req: Request, res: Response) => {
    if (!req.user) {
      return APIError(res, 401, "Non authentifié");
    }

    const user = await usersModel.findUserById(req.user.userId);

    if (!user) {
      return APIError(res, 404, "Utilisateur non trouvé");
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        pseudo: user.pseudo,
        role: user.role,
      },
    });
  },
};


