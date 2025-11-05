import { pgTable, uuid, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { typeTickets } from "./type-tickets";

export const statusEnum = pgEnum("ticket_status", ["TO_DO", "IN_PROGRESS", "DONE"]);
export const priorityEnum = pgEnum("ticket_priority", ["LOW", "MEDIUM", "HIGH"]);

export const tickets = pgTable("tickets", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 1000 }).notNull(),
  status: statusEnum("status").notNull().default("TO_DO"),
  priority: priorityEnum("priority").notNull().default("LOW"),
  due_date: timestamp("due_date", { withTimezone: true }),
  type_id: uuid("type_id").references(() => typeTickets.id, {
    onDelete: "cascade",
  }).notNull(), // On précise la colonne type_id qui est un uuid et non nul
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
