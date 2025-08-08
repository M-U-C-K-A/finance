// src/lib/schemas.ts temporaire
import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Minimum 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  country: z.string().optional(),
});

export const reportSchema = z.object({
  dateFormat: z.enum(["DD/MM/YYYY", "MM/DD/YYYY"]),
  currency: z.enum(["USD", "EUR", "GBP"]),
  exportFormat: z.enum(["PDF", "CSV"]),
});

export const notificationSchema = z.object({
  emailReports: z.boolean(),
  emailAlerts: z.boolean(),
  pushNotifications: z.boolean(),
});

export const securitySchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
}).refine(data => data.newPassword !== data.currentPassword, {
  message: "Le nouveau mot de passe doit être différent",
  path: ["newPassword"],
});

export const billingSchema = z.object({
  plan: z.enum(["free", "pro", "enterprise"]),
  cardLast4: z.string().length(4),
});
