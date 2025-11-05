import { Router } from "express";
import { typeTicketsController } from "./type-ticket.controller";
// import { isAuthenticated, checkRole } from "../middlewares";

const typeTicketRouter = Router();

// Routes pour les types de tickets
typeTicketRouter.post("/", typeTicketsController.create);
typeTicketRouter.get("/:id", typeTicketsController.get);
typeTicketRouter.get("/", typeTicketsController.getAll);
typeTicketRouter.put("/:id", typeTicketsController.update);
typeTicketRouter.delete("/:id", typeTicketsController.delete);

// Avec authentification (décommenter quand les middlewares sont prêts)
// typeTicketRouter.post("/", isAuthenticated, checkRole('admin'), typeTicketsController.create);
// typeTicketRouter.get("/:id", isAuthenticated, typeTicketsController.get);
// typeTicketRouter.get("/", typeTicketsController.getAll);
// typeTicketRouter.put("/:id", isAuthenticated, checkRole('admin'), typeTicketsController.update);
// typeTicketRouter.delete("/:id", isAuthenticated, checkRole('admin'), typeTicketsController.delete);

export default typeTicketRouter;
