import { z } from "zod";

export const profileUpdateSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),
  country: z.string().max(100).optional().or(z.literal("")),
  state: z.string().max(100).optional().or(z.literal("")),
  city: z.string().max(100).optional().or(z.literal("")),
  gender: z.enum(["male", "female", "other", ""]).optional(),
});

export type ProfileUpdateSchema = z.infer<typeof profileUpdateSchema>;