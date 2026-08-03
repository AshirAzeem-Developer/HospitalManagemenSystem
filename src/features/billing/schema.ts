// schema.ts => which data is valid
import { z } from "zod";

export const invoiceSchema = z.object({
  appointment_id: z.string().uuid().nullable(),

  patient_id: z.string().uuid({
    message: "Patient is required",
  }),

  issued_date: z.string().min(1, {
    message: "Issue date is required",
  }),

  due_date: z.string().min(1, {
    message: "Due date is required",
  }),

  subtotal: z.number().min(0, {
    message: "Subtotal cannot be negative",
  }),

  tax_percentage: z.number().min(0).max(100, {
    message: "Tax must be between 0 and 100",
  }),

  discount: z.number().min(0, {
    message: "Discount cannot be negative",
  }),

  total: z.number().min(0, {
    message: "Total cannot be negative",
  }),

  status: z.enum([
    "draft",
    "paid",
    "partially_paid",
    "unpaid",
    "overdue",
  ]),

  notes: z.string().nullable(),
});

export const invoiceItemSchema = z.object({
  invoice_id: z.string().uuid(),

  item_name: z.string().min(1, {
    message: "Item name is required",
  }),

  description: z.string().min(1, {
    message: "Description is required",
  }),

  unit_cost: z.number().min(0),

  quantity: z.number().int().min(1),

  amount: z.number().min(0),
});

export const paymentSchema = z.object({
  invoice_id: z.string().uuid(),

  amount_paid: z.number().min(0, {
    message: "Amount cannot be negative",
  }),

  payment_date: z.string().min(1, {
    message: "Payment date is required",
  }),

  payment_method: z.enum([
    "cash",
    "card",
    "online_transfer",
  ]),

  payment_status: z.enum([
    "success",
    "pending",
    "failed",
  ]),

  reference_number: z.string().min(1, {
    message: "Reference number is required",
  }),
});