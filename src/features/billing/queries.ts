import { supabase } from "@/lib/supabase";
import { Invoice } from "./types";

export async function getInvoices() {
  const { data, error } = await supabase.from("invoices").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getInvoiceById(id: string) {
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

export async function createInvoice(invoice: Invoice) {
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

export async function updateInvoice(invoice: Partial<Invoice>, id: string) {
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

export async function deleteInvoice(id: string) {
  const { data, error } = await supabase.from("invoices").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
