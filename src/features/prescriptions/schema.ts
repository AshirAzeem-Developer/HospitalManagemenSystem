import { z } from "zod";

const MedicineSchema = z.object({
  medicineName: z.string().min(1, "Medicine is required"),

  dosage: z.string().min(1, "Dosage is required"),

  frequency: z.string().min(1, "Frequency is required"),

  duration: z.string().min(1, "Duration is required"),

  timing: z.enum([
    "before_meal",
    "after_meal",
    "anytime",
  ]),

  instructions: z.string().optional(),
});

export const CreatePrescriptionSchema = z.object({
  appointmentId: z.string().uuid(),

  diagnosis: z.string().min(1, "Diagnosis is required"),

  bloodPressure: z.string().optional(),

  temperature: z.coerce.number().optional(),

  pulseRate: z.coerce.number().optional(),

  weight: z.coerce.number().optional(),

  height: z.coerce.number().optional(),

  spo2: z.coerce.number().optional(),

  advice: z.string().optional(),

  medicines: z
    .array(MedicineSchema)
    .min(1, "At least one medicine is required"),
});

export type CreatePrescriptionInput = z.infer<
  typeof CreatePrescriptionSchema
>;