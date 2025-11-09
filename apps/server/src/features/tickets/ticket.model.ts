import { db } from "@/core/config/pool";
import { tickets } from "@/core/database/schemas";
import { NewTicket, UpdateTicket } from "@/core/database/entities";
import { eq } from "drizzle-orm";
import { logger } from "@/shared/utils";


export const ticketsModel = {
  create: async (ticket: NewTicket) => {
    try {
      logger.info("Création du ticket");
      return await db
        .insert(tickets)
        .values(ticket)
        .returning({ id: tickets.id });
    } catch (error: any) {
      logger.error(
        "Erreur lors de la création du ticket:" + error.message
      );
      throw new Error("Erreur lors de la création du ticket");
    }
  },
  get: async (id: string) => {
    try {
      logger.info("Récupération du ticket avec l'ID: " + id);
      return await db
        .select()
        .from(tickets)
        .where(eq(tickets.id, id))
        .limit(1);
    } catch (error: any) {
      logger.error(
        "Erreur lors de la récupération du ticket: " + error.message
      );
      throw new Error("Erreur lors de la récupération du ticket");
    }
  },
  getAll: async () => {
    try {
      logger.info("Récupération de tous les tickets");
      return await db
        .select()
        .from(tickets)
        .orderBy(tickets.created_at);
    } catch (error: any) {
      logger.error(
        "Erreur lors de la récupération des tickets: " + error.message
      );
      throw new Error("Erreur lors de la récupération des tickets");
    }
  },
  update: async (id: string, ticket: UpdateTicket) => {
    try {
      logger.info("Mise à jour du ticket avec l'ID: " + id);
      return await db
        .update(tickets)
        .set(ticket)
        .where(eq(tickets.id, id))
        .returning({ id: tickets.id });
    } catch (error: any) {
      logger.error(
        "Erreur lors de la mise à jour du ticket: " + error.message
      );
      throw new Error("Erreur lors de la mise à jour du ticket");
    }
  },
  delete: async (id: string) => {
    try {
      logger.info("Suppression du ticket avec l'ID: " + id);
      return await db.delete(tickets).where(eq(tickets.id, id));
    } catch (error: any) {
      logger.error(
        "Erreur lors de la suppression du ticket: " + error.message
      );
      throw new Error("Erreur lors de la suppression du ticket");
    }
  },
};
