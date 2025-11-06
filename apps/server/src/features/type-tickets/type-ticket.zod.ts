import { z } from "zod";

export const typeTicketCreateValidation = z.object({
  name: z
    .string()
    .min(1, "Le nom du type de ticket est requis")
    .max(100, "Le nom du type de ticket ne doit pas dépasser 100 caractères.")
    .trim(),
});

export const typeTicketUpdateValidation = z
  .object({
    name: z
      .string()
      .min(1, "Le nom du type de ticket est requis")
      .max(100, "Le nom du type de ticket ne doit pas dépasser 100 caractères.")
      .trim(),
  })
  .partial();
