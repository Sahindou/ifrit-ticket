import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { typeTickets } from "../schemas";

export type TypeTicket = InferSelectModel<typeof typeTickets>;
export type NewTypeTicket = InferInsertModel<typeof typeTickets>;
export type UpdateTypeTicket = Partial<Omit<NewTypeTicket, "id">>;