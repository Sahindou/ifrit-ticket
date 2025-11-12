import {z} from "zod";

export const loginValidation = z.object({
  email: z.string().email("L'adresse e-mail est invalide").trim(),
  password: z.string().min(6).max(100).trim(),
});

export const registerValidation = z.object({
  email: z.string().email("L'adresse e-mail est invalide").trim(),
  password: z.string().min(6).max(100).trim(),
  pseudo: z.string().min(2).max(100).trim(),
});