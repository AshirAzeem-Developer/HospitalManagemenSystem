import { z } from "zod";

export const contactInfoSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters."),

  email: z.string().trim().email("Please enter a valid email address."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must not exceed 72 characters."),

  phone: z
    .string()
    .trim()
    .regex(
      /^03\d{9}$/,
      "Enter a valid Pakistani phone number, e.g. 03001234567.",
    ),

  gender: z.string().min(1, "Please select a gender."),

  specialization: z.string().min(1, "Please select a specialization."),

  qualification: z.string().min(1, "Please select a qualification."),

  consultationFee: z
    .number({
      required_error: "Consultation fee is required.",
      invalid_type_error: "Consultation fee must be a number.",
    })
    .positive("Consultation fee must be greater than 0."),

  status: z.string().min(1, "Please select a status."),

  bio: z.string().trim().min(20, "Bio should be at least 20 characters."),

  profileImage: z.instanceof(File, {
    message: "Profile image is required.",
  }),
});

export const AddressInfoSchema = z.object({
  country: z.string().trim().min(2, "Country is required."),

  state: z.string().trim().min(2, "State is required."),

  city: z.string().trim().min(2, "City is required."),
});

export const DoctorScheduleSchema = z
  .object({
    dayOfWeek: z
      .number()
      .int()
      .min(0)
      .max(6),

    startTime: z
      .string()
      .min(1, "Start time is required."),

    endTime: z
      .string()
      .min(1, "End time is required."),

    slotDurationMinutes: z
      .number()
      .int()
      .positive("Slot duration must be greater than 0."),

    isActive: z.boolean(),
  })
  .refine(
    (data) => data.startTime < data.endTime,
    {
      message: "End time must be after start time.",
      path: ["endTime"],
    }
  );

export const DoctorSchedulesSchema = z
  .array(DoctorScheduleSchema)
  .min(1, "At least one schedule is required.");

export type DoctorScheduleInput = z.infer<
  typeof DoctorScheduleSchema
>;

export type DoctorSchedulesInput = z.infer<
  typeof DoctorSchedulesSchema
>;

export const editContactInfoSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters."),

  // Email is read-only in the UI, but still required for validation.
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),

  // Optional during edit.
  // Empty string = keep the existing password.
  password: z
    .string()
    .max(72, "Password must not exceed 72 characters.")
    .refine(
      (value) => value === "" || value.length >= 8,
      "Password must be at least 8 characters.",
    ),

  phone: z
    .string()
    .trim()
    .regex(
      /^03\d{9}$/,
      "Enter a valid Pakistani phone number, e.g. 03001234567.",
    ),

  gender: z.string().min(1, "Please select a gender."),

  specialization: z
    .string()
    .min(1, "Please select a specialization."),

  qualification: z
    .string()
    .min(1, "Please select a qualification."),

  consultationFee: z
    .number({
      required_error: "Consultation fee is required.",
      invalid_type_error: "Consultation fee must be a number.",
    })
    .positive("Consultation fee must be greater than 0."),

  status: z.string().min(1, "Please select a status."),

  bio: z
    .string()
    .trim()
    .min(20, "Bio should be at least 20 characters."),

  // Optional during edit.
  // null = don't replace existing image.
  profileImage: z.instanceof(File).nullable(),
});

export type ContactInfoInput = z.infer<typeof contactInfoSchema>;
export type AddressInfoInput = z.infer<typeof AddressInfoSchema>;
