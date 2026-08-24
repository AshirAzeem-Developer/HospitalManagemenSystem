export type InvoiceStatus = "paid" | "partially_paid" | "unpaid";

export type PaymentMethod = "cash" | "card";

export type PaymentStatus = "pending" | "success" | "failed";

// INVOICE

export interface Invoice {
  id: string;
  invoice_number: string | null;
  appointment_id: string | null;
  patient_id: string;
  issued_date: string;
  due_date: string | null;
  subtotal: number;
  tax_percentage: number;
  discount: number;
  total: number;
  status: InvoiceStatus;
  notes: string | null;

  patients?: {
    profile_id: string;

    profiles?: {
      full_name: string;
      avatar_url: string | null;
    };
  };
}

// NEW INVOICE

export type NewInvoice = Omit<
  Invoice,
  "id" | "invoice_number" | "patients" | "notes"
> & {
  invoice_number?: string | null;
  notes?: string | null;
};

// INVOICE ITEMS

export interface InvoiceItems {
  id: string;
  invoice_id: string;
  item_name: string;
  description: string | null;
  unit_cost: number;
  quantity: number;
  amount: number;
}

export type NewInvoiceItems = Omit<InvoiceItems, "id">;

// PAYMENT

export interface Payment {
  id: string;
  invoice_id: string;
  amount_paid: number;
  payment_date: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  reference_number: string | null;

  invoices?: {
    id: string;
    invoice_number: string | null;
  };
}

// NEW PAYMENT

export type NewPayment = Omit<
  Payment,
  "id" | "invoices" | "reference_number"
> & {
  reference_number?: string | null;
};
