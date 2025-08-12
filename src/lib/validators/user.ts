// src/lib/validators/user.ts
import { z } from "zod";

export const userProfileSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(30, { message: "Name must be at most 30 characters" })
    .regex(/^[a-zA-Z0-9 ]+$/),
    email: z.string()
    .min(1, { message: "Email is required" })
    .max(50, { message: "Email must be at most 50 characters" })
    .email({ message: "Invalid email" })
    .regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
  image: z.string().url().optional().or(z.literal("")),
  bio: z.string().max(500, {
    message: "La bio ne doit pas dépasser 500 caractères.",
  }).optional(),
  isPublic: z.boolean(),
});

export type UserProfileValues = z.infer<typeof userProfileSchema>;
