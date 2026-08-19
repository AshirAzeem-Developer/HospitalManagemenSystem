import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

import type {
  Invoice,
  NewInvoice,
  InvoiceItems,
  NewInvoiceItems,
  Payment,
  NewPayment,
} from "./types";

// PATIENTS FOR INVOICE

export async function getInvoicePatients() {
  console.log("GET INVOICE PATIENTS START");

  const supabase = await createClient();

  const { data: patients, error } = await supabase.from("patients").select(`
      id,
      profile_id,
      stay_address,
      permanent_address,
      profiles (
        id,
        full_name
      )
    `);

  console.log("PATIENTS:", patients);
  console.log("PATIENTS ERROR:", error);

  if (error) {
    console.error("GET INVOICE PATIENTS ERROR:", error);

    throw new Error(error.message);
  }

  if (!patients || patients.length === 0) {
    console.log("NO PATIENTS FOUND");
    return [];
  }

  const result = await Promise.all(
    patients.map(async (patient: any) => {
      console.log("PROCESSING PATIENT:", patient.id);

      const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.getUserById(patient.profile_id);

      if (authError) {
        console.error("AUTH USER ERROR:", authError.message);
      }

      const profile = Array.isArray(patient.profiles)
        ? patient.profiles[0]
        : patient.profiles;

      const patientData = {
        id: patient.id,

        profile_id: patient.profile_id,

        name: profile?.full_name ?? "Unknown Patient",

        email: authData?.user?.email ?? "",

        phone: authData?.user?.phone ?? "",

        address: patient.stay_address ?? patient.permanent_address ?? "—",
      };

      console.log("FINAL PATIENT:", patientData);

      return patientData;
    })
  );

  return result;
}

// INVOICES

export async function getInvoices(): Promise<Invoice[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      patients (
        profile_id,
        profiles (
          full_name,
          avatar_url
        )
      )
    `
    )
    .order("issued_date", {
      ascending: false,
    });

  if (error) {
    console.error("GET INVOICES ERROR:", error);

    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getInvoiceById(id: string): Promise<Invoice> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      patients (
        profile_id,
        profiles (
          full_name,
          avatar_url
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("GET INVOICE BY ID ERROR:", error);

    throw new Error(error.message);
  }

  return data;
}

export async function createInvoice(invoice: NewInvoice): Promise<Invoice> {
  const supabase = await createClient();

  console.log("CREATE INVOICE INPUT:", invoice);

  const { data, error } = await supabase
    .from("invoices")
    .insert(invoice)
    .select(
      `
      *,
      patients (
        profile_id,
        profiles (
          full_name,
          avatar_url
        )
      )
    `
    )
    .single();

  if (error) {
    console.error("CREATE INVOICE ERROR:", error);

    throw new Error(error.message);
  }

  console.log("CREATED INVOICE:", data);

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
    .select(
      `
      *,
      patients (
        profile_id,
        profiles (
          full_name,
          avatar_url
        )
      )
    `
    )
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

// INVOICE ITEMS

export async function getInvoiceItems(): Promise<InvoiceItems[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoice_items")
    .select("*")
    .order("id", {
      ascending: false,
    });

  if (error) {
    console.error("GET INVOICE ITEMS ERROR:", error);

    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getPatientInvoices(
  profileId: string
): Promise<Invoice[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      patients!inner(
        profile_id,
        profiles(
          full_name,
          avatar_url
        )
      )
    `)
    .eq("patients.profile_id", profileId);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getInvoiceItemsByInvoiceId(
  invoiceId: string
): Promise<InvoiceItems[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", invoiceId);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
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
  invoiceItem: NewInvoiceItems
): Promise<InvoiceItems> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoice_items")
    .insert(invoiceItem)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateInvoiceItem(
  invoiceItem: Partial<NewInvoiceItems>,
  id: string
): Promise<InvoiceItems> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoice_items")
    .update(invoiceItem)
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

// PAYMENTS

export async function getPayments(): Promise<Payment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .select(
      `
      *,
      invoices (
        id,
        invoice_number
      )
    `
    )
    .order("payment_date", {
      ascending: false,
    });

  if (error) {
    console.error("GET PAYMENTS ERROR:", error);

    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getPaymentsByInvoiceId(
  invoiceId: string
): Promise<Payment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .select(
      `
      *,
      invoices (
        id,
        invoice_number
      )
    `
    )
    .eq("invoice_id", invoiceId)
    .order("payment_date", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getPaymentById(id: string): Promise<Payment> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .select(
      `
      *,
      invoices (
        id,
        invoice_number
      )
    `
    )
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
