import { Router } from "express";
import { ticketRouter } from "@/features/tickets";
import { typeTicketRouter } from "@/features/type-tickets";
import { authRouter } from "@/features/auth/auth.route";

const router = Router();

// Monter les routes des tickets
router.use("/tickets", ticketRouter);

// Monter les routes des types de tickets
router.use("/type-tickets", typeTicketRouter);
router.use("/auth", authRouter);

// Ajouter d'autres routes ici au fur et à mesure
// router.use("/users", userRouter);
// 

export default router;
