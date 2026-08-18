import { z } from "zod";

export const patientSchema = z.object({
  email: z.string().email("Invalid email"),
 password: z
  .string()
  .refine(
    (value) => value === "" || value.length >= 6,
    "Password must be atleast 6 characters"
  ),
  phone: z
  .string()
  .trim()
  .regex(
    /^03\d{9}$/,
    "Enter a valid Pakistani phone number, e.g. 03001234567.",
  ),
  full_name: z.string().min(3),
  gender: z.string(),
  date_of_birth:z.string(),
  blood_group:z.string(),
  primary_doctor_id:z.string().uuid(),
  stay_address:z.string(),
  permanent_address:z.string(),
  country:z.string(),
  state:z.string(),
  city:z.string(),
});