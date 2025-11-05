import { Router } from "express";
import { ticketRouter } from "@/features/tickets";
import { typeTicketRouter } from "@/features/type-tickets";

const router = Router();

// Monter les routes des tickets
router.use("/tickets", ticketRouter);

// Monter les routes des types de tickets
router.use("/type-tickets", typeTicketRouter);

// Ajouter d'autres routes ici au fur et � mesure
// router.use("/users", userRouter);
// router.use("/auth", authRouter);

export default router;
