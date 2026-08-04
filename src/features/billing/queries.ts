// queries.ts => defines database queries (CRUD) for invoices, invoice items, and payments.
import { createClient } from "@/lib/supabase/server";

import type {
  Invoice,
  NewInvoice,
  InvoiceItems,
  NewInvoiceItems,
  Payment,
  NewPayment,
} from "./types";

// invoice
export async function getInvoices(): Promise<Invoice[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("invoices").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getInvoiceById(id: string): Promise<Invoice> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createInvoice(invoice: NewInvoice): Promise<Invoice> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoices")
    .insert(invoice)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateInvoice(
  invoice: Partial<NewInvoice>,
  id: string
): Promise<Invoice> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoices")
    .update(invoice)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteInvoice(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("invoices").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

// invoice_items
export async function getInvoiceItems(): Promise<InvoiceItems[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("invoice_items").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getInvoiceItemById(id: string): Promise<InvoiceItems> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createInvoiceItem(
  invoice: NewInvoiceItems
): Promise<InvoiceItems> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoice_items")
    .insert(invoice)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateInvoiceItem(
  invoice: Partial<NewInvoiceItems>,
  id: string
): Promise<InvoiceItems> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoice_items")
    .update(invoice)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteInvoiceItem(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("invoice_items").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

// payments
export async function getPayments(): Promise<Payment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("payments").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getPaymentById(id: string): Promise<Payment> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createPayment(payment: NewPayment): Promise<Payment> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .insert(payment)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updatePayment(
  payment: Partial<NewPayment>,
  id: string
): Promise<Payment> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .update(payment)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deletePayment(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("payments").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
