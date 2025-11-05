import { db } from "@/core/config/pool";
import { typeTickets } from "@/core/database/schemas";
import { NewTypeTicket, UpdateTypeTicket } from "@/core/database/entities";
import { eq } from "drizzle-orm";
import { logger } from "@/shared/utils";

export const typeTicketsModel = {
  create: async (typeTicket: NewTypeTicket) => {
    try {
      logger.info("Création du type de ticket");
      return await db
        .insert(typeTickets)
        .values(typeTicket)
        .returning({ id: typeTickets.id });
    } catch (error: any) {
      logger.error(
        "Erreur lors de la création du type de ticket: " + error.message
      );
      throw new Error("Erreur lors de la création du type de ticket");
    }
  },
  get: async (id: string) => {
    try {
      logger.info("Récupération du type de ticket avec l'ID: " + id);
      return await db
        .select()
        .from(typeTickets)
        .where(eq(typeTickets.id, id))
        .limit(1);
    } catch (error: any) {
      logger.error(
        "Erreur lors de la récupération du type de ticket: " + error.message
      );
      throw new Error("Erreur lors de la récupération du type de ticket");
    }
  },
  getAll: async () => {
    try {
      logger.info("Récupération de tous les types de tickets");
      return await db
        .select()
        .from(typeTickets)
        .orderBy(typeTickets.name);
    } catch (error: any) {
      logger.error(
        "Erreur lors de la récupération des types de tickets: " + error.message
      );
      throw new Error("Erreur lors de la récupération des types de tickets");
    }
  },
  update: async (id: string, typeTicket: UpdateTypeTicket) => {
    try {
      logger.info("Mise à jour du type de ticket avec l'ID: " + id);
      return await db
        .update(typeTickets)
        .set(typeTicket)
        .where(eq(typeTickets.id, id))
        .returning({ id: typeTickets.id });
    } catch (error: any) {
      logger.error(
        "Erreur lors de la mise à jour du type de ticket: " + error.message
      );
      throw new Error("Erreur lors de la mise à jour du type de ticket");
    }
  },
  delete: async (id: string) => {
    try {
      logger.info("Suppression du type de ticket avec l'ID: " + id);
      return await db.delete(typeTickets).where(eq(typeTickets.id, id));
    } catch (error: any) {
      logger.error(
        "Erreur lors de la suppression du type de ticket: " + error.message
      );
      throw new Error("Erreur lors de la suppression du type de ticket");
    }
  },
};
