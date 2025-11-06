import { pgTable, uuid, varchar, pgEnum } from "drizzle-orm/pg-core";

//* mettre en place un enum pour les roles utilisateurs */
export const roleEnum = pgEnum("user_role", ["ADMIN", "USER", "MODERATOR"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  pseudo: varchar("pseudo", {length: 50}).notNull(),
  email: varchar("email", {length: 255}).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: roleEnum("role").notNull().default("USER"),
});
