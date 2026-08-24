import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

import type {
  Invoice,
  NewInvoice,
  InvoiceItems,
  NewInvoiceItems,
  Payment,
  NewPayment,
  InvoiceStatus,
} from "./types";

// PATIENTS

export async function getInvoicePatients() {
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

  if (error) {
    throw new Error(error.message);
  }

  if (!patients) {
    return [];
  }

  const result = await Promise.all(
    patients.map(async (patient: any) => {
      let authEmail = "";
      let authPhone = "";

      if (patient.profile_id) {
        const { data: authData, error: authError } =
          await supabaseAdmin.auth.admin.getUserById(patient.profile_id);

        if (authError) {
          console.error("GET AUTH USER ERROR:", authError.message);
        }

        authEmail = authData?.user?.email ?? "";
        authPhone = authData?.user?.phone ?? "";
      }

      const profile = Array.isArray(patient.profiles)
        ? patient.profiles[0]
        : patient.profiles;

      return {
        id: patient.id,
        profile_id: patient.profile_id,
        name: profile?.full_name ?? "Unknown Patient",
        email: authEmail,
        phone: authPhone,
        address: patient.stay_address ?? patient.permanent_address ?? "—",
      };
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
    throw new Error(error.message);
  }

  return data;
}

export async function createInvoice(invoice: NewInvoice): Promise<Invoice> {
  const supabase = await createClient();

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

// PATIENT INVOICES

export async function getPatientInvoices(
  profileId: string
): Promise<Invoice[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      patients!inner (
        profile_id,
        profiles (
          full_name,
          avatar_url
        )
      )
    `
    )
    .eq("patients.profile_id", profileId)
    .order("issued_date", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
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
    .eq("invoice_id", invoiceId)
    .order("id", {
      ascending: true,
    });

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

// CALCULATE INVOICE STATUS

export async function calculateInvoiceStatus(
  invoiceId: string
): Promise<InvoiceStatus> {
  const supabase = await createClient();

  // Get invoice total
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("total")
    .eq("id", invoiceId)
    .single();

  if (invoiceError) {
    throw new Error(invoiceError.message);
  }

  // Only successful payments count
  const { data: payments, error: paymentsError } = await supabase
    .from("payments")
    .select(
      `
      amount_paid,
      payment_status
    `
    )
    .eq("invoice_id", invoiceId)
    .eq("payment_status", "success");

  if (paymentsError) {
    throw new Error(paymentsError.message);
  }

  const totalPaid = (payments ?? []).reduce(
    (sum, payment) => sum + Number(payment.amount_paid || 0),
    0
  );

  const total = Number(invoice.total || 0);

  // Fully paid
  if (totalPaid >= total && total > 0) {
    return "paid";
  }

  // Partially paid
  if (totalPaid > 0 && totalPaid < total) {
    return "partially_paid";
  }

  // No successful payment
  return "unpaid";
}

// SYNC INVOICE STATUS

export async function syncInvoiceStatus(invoiceId: string) {
  const supabase = await createClient();

  const status = await calculateInvoiceStatus(invoiceId);

  const { error } = await supabase
    .from("invoices")
    .update({
      status,
    })
    .eq("id", invoiceId);

  if (error) {
    throw new Error(error.message);
  }

  return status;
}

// CREATE PAYMENT

export async function createPayment(payment: NewPayment): Promise<Payment> {
  const supabase = await createClient();

  // Get invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select(
      `
      id,
      total
    `
    )
    .eq("id", payment.invoice_id)
    .single();

  if (invoiceError) {
    throw new Error(invoiceError.message);
  }

  // Get all successful payments
  const { data: existingPayments, error: paymentsError } = await supabase
    .from("payments")
    .select("amount_paid")
    .eq("invoice_id", payment.invoice_id)
    .eq("payment_status", "success");

  if (paymentsError) {
    throw new Error(paymentsError.message);
  }

  const alreadyPaid = (existingPayments ?? []).reduce(
    (sum, item) => sum + Number(item.amount_paid || 0),
    0
  );

  const invoiceTotal = Number(invoice.total || 0);

  const newPayment = Number(payment.amount_paid || 0);

  const remainingBeforePayment = invoiceTotal - alreadyPaid;

  // Payment cannot exceed remaining amount
  if (newPayment > remainingBeforePayment) {
    throw new Error(
      `Payment cannot be greater than remaining amount ($${remainingBeforePayment.toFixed(
        2
      )}).`
    );
  }

  // Payment must be greater than 0
  if (newPayment <= 0) {
    throw new Error("Payment amount must be greater than 0.");
  }

  // If invoice is already fully paid
  if (remainingBeforePayment <= 0) {
    throw new Error("This invoice is already fully paid.");
  }

  const paymentToInsert = {
    ...payment,

    // Default payment transaction to success
    payment_status: payment.payment_status ?? "success",
  };

  const { data, error } = await supabase
    .from("payments")
    .insert(paymentToInsert)
    .select(
      `
      *,
      invoices (
        id,
        invoice_number
      )
    `
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Automatically update invoice status
  await syncInvoiceStatus(payment.invoice_id);

  return data;
}

// UPDATE PAYMENT

export async function updatePayment(
  payment: Partial<NewPayment>,
  id: string
): Promise<Payment> {
  const supabase = await createClient();

  // Get old payment
  const { data: oldPayment, error: oldPaymentError } = await supabase
    .from("payments")
    .select(
      `
      invoice_id,
      amount_paid
    `
    )
    .eq("id", id)
    .single();

  if (oldPaymentError) {
    throw new Error(oldPaymentError.message);
  }

  // If invoice_id is being changed,
  // remember the new invoice too.
  const oldInvoiceId = oldPayment.invoice_id;

  const newInvoiceId = payment.invoice_id ?? oldInvoiceId;

  // If amount or invoice changes,
  // validate the new payment amount.
  if (payment.amount_paid !== undefined || payment.invoice_id !== undefined) {
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("id, total")
      .eq("id", newInvoiceId)
      .single();

    if (invoiceError) {
      throw new Error(invoiceError.message);
    }

    const { data: existingPayments, error: existingError } = await supabase
      .from("payments")
      .select(
        `
        id,
        amount_paid,
        payment_status
      `
      )
      .eq("invoice_id", newInvoiceId)
      .eq("payment_status", "success")
      .neq("id", id);

    if (existingError) {
      throw new Error(existingError.message);
    }

    const alreadyPaid = (existingPayments ?? []).reduce(
      (sum, item) => sum + Number(item.amount_paid || 0),
      0
    );

    const newAmount = payment.amount_paid ?? Number(oldPayment.amount_paid);

    const invoiceTotal = Number(invoice.total || 0);

    const remaining = invoiceTotal - alreadyPaid;

    if (newAmount <= 0) {
      throw new Error("Payment amount must be greater than 0.");
    }

    if (newAmount > remaining) {
      throw new Error(
        `Payment cannot be greater than remaining amount ($${remaining.toFixed(
          2
        )}).`
      );
    }
  }

  const { data, error } = await supabase
    .from("payments")
    .update(payment)
    .eq("id", id)
    .select(
      `
      *,
      invoices (
        id,
        invoice_number
      )
    `
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Sync old invoice
  await syncInvoiceStatus(oldInvoiceId);

  // If moved to another invoice,
  // sync new invoice as well.
  if (newInvoiceId !== oldInvoiceId) {
    await syncInvoiceStatus(newInvoiceId);
  }

  return data;
}

// DELETE PAYMENT

export async function deletePayment(id: string): Promise<void> {
  const supabase = await createClient();

  // Get invoice before deleting
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .select("invoice_id")
    .eq("id", id)
    .single();

  if (paymentError) {
    throw new Error(paymentError.message);
  }

  // Delete payment
  const { error } = await supabase.from("payments").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  // Recalculate invoice status
  await syncInvoiceStatus(payment.invoice_id);
}
