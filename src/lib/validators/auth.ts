// src/lib/validators/auth.ts
import { z } from "zod";

// Schémas atomiques réutilisables
export const emailSchema = z.string()
  .min(1, "Email is required")
  .max(50, "Email must be at most 50 characters")
  .email("Invalid email");
export const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .max(50, "Password must be at most 50 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");
export const nameSchema = z.string()
  .min(2, "Name must be at least 2 characters")
  .max(30, "Name must be at most 30 characters")
  .regex(/^[a-zA-Z0-9 ]+$/, "Only letters, numbers and spaces allowed");

// Combinaisons pour différents formulaires
export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  password: passwordSchema,
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
});

export const newPasswordSchema = z.object({
  password: passwordSchema,
});

// Types
export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type NewPasswordValues = z.infer<typeof newPasswordSchema>;
