import { Router } from "express";
import { ticketsController } from "./ticket.controller";
// import { isAuthenticated, checkRole } from "../middlewares";

const ticketRouter = Router();

// Routes pour les tickets
ticketRouter.post("/", ticketsController.create);
ticketRouter.get("/:id", ticketsController.get);
ticketRouter.get("/", ticketsController.getAll);
ticketRouter.put("/:id", ticketsController.update);
ticketRouter.delete("/:id", ticketsController.delete);

// Avec authentification (décommenter quand les middlewares sont prêts)
// ticketRouter.post("/", isAuthenticated, checkRole('admin'), ticketsController.create);
// ticketRouter.get("/:id", isAuthenticated, ticketsController.get);
// ticketRouter.get("/", ticketsController.getAll);
// ticketRouter.put("/:id", isAuthenticated, checkRole('admin'), ticketsController.update);
// ticketRouter.delete("/:id", isAuthenticated, checkRole('admin'), ticketsController.delete);

export default ticketRouter;