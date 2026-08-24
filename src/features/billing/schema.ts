import { z } from "zod";

// INVOICE

export const invoiceSchema = z.object({
  invoice_number: z.string().nullable().optional(),

  appointment_id: z.string().uuid().nullable(),

  patient_id: z.string().uuid({
    message: "Patient is required",
  }),

  issued_date: z.string().min(1, "Issue date is required"),

  // Required
  due_date: z.string().min(1, "Due date is required"),

  subtotal: z.number().min(0),

  tax_percentage: z.number().min(0).max(100),

  discount: z.number().min(0).max(100),

  total: z.number().min(0),

  status: z.enum(["paid", "partially_paid", "unpaid"]),

  // Optional
  notes: z.string().nullable().optional(),
});

// INVOICE ITEM

export const invoiceItemSchema = z.object({
  invoice_id: z.string().uuid(),

  item_name: z.string().min(1, "Item name is required"),

  // Required
  description: z.string().min(1, "Description is required"),

  unit_cost: z.number().min(0),

  quantity: z.number().int().min(1),

  amount: z.number().min(0),
});

// PAYMENT

export const paymentSchema = z.object({
  invoice_id: z.string().uuid(),

  amount_paid: z.number().positive("Payment amount must be greater than 0"),

  payment_date: z.string().min(1, "Payment date is required"),

  payment_method: z.enum(["cash", "card"]),

  // Payment transaction status
  payment_status: z.enum(["pending", "success", "failed"]),

  // Optional
  reference_number: z.string().nullable().optional(),
});
