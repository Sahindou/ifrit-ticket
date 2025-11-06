import { Request, Response } from "express";
import { APIResponse, APIError, logger } from "@/shared/utils";
import { ticketsModel } from "./ticket.model";
import { z } from "zod";
import { ticketCreateValidation, ticketUpdateValidation } from "./ticket.zod";

export const ticketsController = {
  create: async (req: Request, res: Response) => {
    try {
      const { title, description, status, priority, due_date, type_id } =
        ticketCreateValidation.parse(req.body);

      logger.debug(`Create ticket`);

      // Convertir la date au format DD-MM-YYYY en objet Date si présente
      let dueDateObject: Date | undefined = undefined;
      if (due_date) {
        const [day, month, year] = due_date.split('-');
        dueDateObject = new Date(`${year}-${month}-${day}`);
      }

      const newTicket = await ticketsModel.create({
        title,
        description,
        status,
        priority,
        due_date: dueDateObject,
        type_id,
      });
      APIResponse(res, newTicket, "Ticket créé avec succès.", 201);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        logger.error("Validation error: " + error.message);
        APIError(res, 400, "Le formulaire est invalide", error);
        return;
      }

      APIError(
        res,
        500,
        "Erreur lors de la création du ticket: " + error.message,
        error
      );
    }
  },
  get: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      if (!id) {
        APIError(res, 400, "L'ID du ticket est requis.");
        return;
      }
      const ticket = await ticketsModel.get(id);
      if (ticket.length === 0) {
        APIError(res, 404, "Ticket non trouvé.");
        return;
      }
      APIResponse(res, ticket[0], "Ticket récupéré avec succès.");
    } catch (error: any) {
      logger.error(
        "Erreur lors de la récupération du ticket: " + error.message
      );
      APIError(
        res,
        500,
        "Erreur lors de la récupération du ticket: " + error.message,
        error
      );
    }
  },
  getAll: async (req: Request, res: Response) => {
    try {
      const tickets = await ticketsModel.getAll();
      APIResponse(
        res,
        tickets,
        "Liste des tickets récupérée avec succès."
      );
    } catch (error: any) {
      logger.error(
        "Erreur lors de la récupération des tickets: " + error.message
      );
      APIError(
        res,
        500,
        "Erreur lors de la récupération des tickets: " + error.message,
        error
      );
    }
  },
  update: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      if (!id) {
        APIError(res, 400, "L'ID du ticket est requis.");
        return;
      }
      const validatedData = ticketUpdateValidation.parse(req.body);

      const existingTicket = await ticketsModel.get(id);
      if (existingTicket.length === 0) {
        APIError(res, 404, "Ticket non trouvé.");
        return;
      }

      // Convertir la date au format DD-MM-YYYY en objet Date si présente
      const updateData: any = { ...validatedData };
      if (validatedData.due_date) {
        const [day, month, year] = validatedData.due_date.split('-');
        updateData.due_date = new Date(`${year}-${month}-${day}`);
      }

      const updatedTicket = await ticketsModel.update(id, updateData);
      APIResponse(
        res,
        updatedTicket[0],
        "Ticket mis à jour avec succès."
      );
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        logger.error("Validation error: " + error.message);
        APIError(res, 400, "Le formulaire est invalide", error);
        return;
      }
      logger.error(
        "Erreur lors de la mise à jour du ticket: " + error.message
      );
      APIError(
        res,
        500,
        "Erreur lors de la mise à jour du ticket: " + error.message,
        error
      );
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      if (!id) {
        APIError(res, 400, "L'ID du ticket est requis.");
        return;
      }
      const existingTicket = await ticketsModel.get(id);
      if (existingTicket.length === 0) {
        APIError(res, 404, "Ticket non trouvé.");
        return;
      }
      await ticketsModel.delete(id);
      APIResponse(res, null, "Ticket supprimé avec succès.");
    } catch (error: any) {
      logger.error(
        "Erreur lors de la suppression du ticket: " + error.message
      );
      APIError(
        res,
        500,
        "Erreur lors de la suppression du ticket: " + error.message,
        error
      );
    }
  },
};
