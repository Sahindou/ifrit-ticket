import { z } from "zod";

export const ticketCreateValidation = z.object({
  title: z
    .string()
    .min(1, "Le titre du ticket est requis")
    .max(255, "Le titre du ticket ne doit pas dépasser 255 caractères.")
    .trim(),
  description: z
    .string()
    .min(1, "La description du ticket est requise")
    .max(1000, "La description du ticket ne doit pas dépasser 1000 caractères.")
    .trim(),
  status: z.enum(["TO_DO", "IN_PROGRESS", "DONE"]).optional().default("TO_DO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional().default("LOW"),
  due_date: z
    .string()
    .trim()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "La date doit être au format DD-MM-YYYY")
    .optional(),
  type_id: z.string().uuid("L'ID du type de ticket doit être un UUID valide"),
});

export const ticketUpdateValidation = z
  .object({
    title: z
      .string()
      .min(1, "Le titre du ticket est requis")
      .max(255, "Le titre du ticket ne doit pas dépasser 255 caractères.")
      .trim(),
    description: z
      .string()
      .min(1, "La description du ticket est requise")
      .max(
        1000,
        "La description du ticket ne doit pas dépasser 1000 caractères."
      )
      .trim(),
    status: z
      .enum(["TO_DO", "IN_PROGRESS", "DONE"])
      .optional()
      .default("TO_DO"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional().default("LOW"),
    due_date: z
      .string()
      .trim()
      .regex(/^\d{2}-\d{2}-\d{4}$/, "La date doit être au format DD-MM-YYYY")
      .optional(),
    type_id: z.string().uuid("L'ID du type de ticket doit être un UUID valide"),
  })
  .partial();
