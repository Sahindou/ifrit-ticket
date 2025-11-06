import { Request, Response } from "express";
import { APIResponse, APIError, logger } from "@/shared/utils";
import { typeTicketsModel } from "./type-ticket.model";
import { z } from "zod";
import { typeTicketCreateValidation, typeTicketUpdateValidation } from "./type-ticket.zod";

export const typeTicketsController = {
  create: async (req: Request, res: Response) => {
    try {
      const { name } = typeTicketCreateValidation.parse(req.body);

      logger.debug(`Create type ticket`);
      const newTypeTicket = await typeTicketsModel.create({ name });
      APIResponse(res, newTypeTicket, "Type de ticket créé avec succès.", 201);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        logger.error("Validation error: " + error.message);
        APIError(res, 400, "Le formulaire est invalide", error);
        return;
      }

      APIError(
        res,
        500,
        "Erreur lors de la création du type de ticket: " + error.message,
        error
      );
    }
  },
  get: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      if (!id) {
        APIError(res, 400, "L'ID du type de ticket est requis.");
        return;
      }
      const typeTicket = await typeTicketsModel.get(id);
      if (typeTicket.length === 0) {
        APIError(res, 404, "Type de ticket non trouvé.");
        return;
      }
      APIResponse(res, typeTicket[0], "Type de ticket récupéré avec succès.");
    } catch (error: any) {
      logger.error(
        "Erreur lors de la récupération du type de ticket: " + error.message
      );
      APIError(
        res,
        500,
        "Erreur lors de la récupération du type de ticket: " + error.message,
        error
      );
    }
  },
  getAll: async (_req: Request, res: Response) => {
    try {
      const typeTickets = await typeTicketsModel.getAll();
      APIResponse(
        res,
        typeTickets,
        "Liste des types de tickets récupérée avec succès."
      );
    } catch (error: any) {
      logger.error(
        "Erreur lors de la récupération des types de tickets: " + error.message
      );
      APIError(
        res,
        500,
        "Erreur lors de la récupération des types de tickets: " + error.message,
        error
      );
    }
  },
  update: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      if (!id) {
        APIError(res, 400, "L'ID du type de ticket est requis.");
        return;
      }
      const validatedData = typeTicketUpdateValidation.parse(req.body);

      const existingTypeTicket = await typeTicketsModel.get(id);
      if (existingTypeTicket.length === 0) {
        APIError(res, 404, "Type de ticket non trouvé.");
        return;
      }

      const updatedTypeTicket = await typeTicketsModel.update(id, validatedData);
      APIResponse(
        res,
        updatedTypeTicket[0],
        "Type de ticket mis à jour avec succès."
      );
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        logger.error("Validation error: " + error.message);
        APIError(res, 400, "Le formulaire est invalide", error);
        return;
      }
      logger.error(
        "Erreur lors de la mise à jour du type de ticket: " + error.message
      );
      APIError(
        res,
        500,
        "Erreur lors de la mise à jour du type de ticket: " + error.message,
        error
      );
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      if (!id) {
        APIError(res, 400, "L'ID du type de ticket est requis.");
        return;
      }
      const existingTypeTicket = await typeTicketsModel.get(id);
      if (existingTypeTicket.length === 0) {
        APIError(res, 404, "Type de ticket non trouvé.");
        return;
      }
      await typeTicketsModel.delete(id);
      APIResponse(res, null, "Type de ticket supprimé avec succès.");
    } catch (error: any) {
      logger.error(
        "Erreur lors de la suppression du type de ticket: " + error.message
      );
      APIError(
        res,
        500,
        "Erreur lors de la suppression du type de ticket: " + error.message,
        error
      );
    }
  },
};
