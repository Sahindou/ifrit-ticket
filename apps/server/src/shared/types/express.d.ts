import { JwtPayload } from "jsonwebtoken";

// Extension de l'interface JwtPayload pour inclure nos propriétés personnalisées
export interface CustomJwtPayload extends JwtPayload {
  userId: string;
  role: "USER" | "ADMIN" | "MODERATOR";
  tokenVersion?: number;
}

// Extension de l'interface Request d'Express
declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
    }
  }
}
