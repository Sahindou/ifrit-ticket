import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { tickets } from "../schemas";

export type Ticket = InferSelectModel<typeof tickets>;
export type NewTicket = InferInsertModel<typeof tickets>;
export type UpdateTicket = Partial<Omit<NewTicket, "id">>;