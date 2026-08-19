"use server";

import type { NewInvoice, NewInvoiceItems, NewPayment } from "./types";

import {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoices,
  getInvoiceItemsByInvoiceId,
  getInvoiceById,
  createInvoiceItem,
  updateInvoiceItem,
  deleteInvoiceItem,
  getInvoiceItems,
  getInvoiceItemById,
  createPayment,
  updatePayment,
  deletePayment,
  getPayments,
  getPaymentById,
  getPaymentsByInvoiceId,
  getInvoicePatients,
} from "./queries";

import { invoiceSchema, invoiceItemSchema, paymentSchema } from "./schema";

// PATIENTS

export async function getInvoicePatientsAction() {
  console.log("GET INVOICE PATIENTS ACTION CALLED");

  try {
    const result = await getInvoicePatients();

    console.log("PATIENTS ACTION RESULT:", result);

    return result;
  } catch (error) {
    console.error(error);

    throw error;
  }
}

// INVOICES

export async function getInvoicesAction() {
  console.log("GET INVOICES ACTION CALLED");

  return await getInvoices();
}

export async function getInvoiceItemsByInvoiceIdAction(invoiceId: string) {
  return await getInvoiceItemsByInvoiceId(invoiceId);
}

export async function getInvoiceByIdAction(id: string) {
  return await getInvoiceById(id);
}

export async function createInvoiceAction(invoice: NewInvoice) {
  try {
    /*
      invoice_number is optional here because Supabase generates it.
     */
    const validatedData = invoiceSchema.parse(invoice);

    console.log("VALIDATED INVOICE:", validatedData);

    const createdInvoice = await createInvoice(validatedData);

    console.log("INVOICE CREATED SUCCESSFULLY:", createdInvoice);

    return createdInvoice;
  } catch (error) {
    console.error(error);

    throw error;
  }
}

export async function updateInvoiceAction(
  id: string,
  invoice: Partial<NewInvoice>
) {
  console.log("UPDATE INVOICE ACTION:", id, invoice);

  try {
    const validatedData = invoiceSchema.partial().parse(invoice);

    return await updateInvoice(validatedData, id);
  } catch (error) {
    console.error(error);

    throw error;
  }
}

export async function deleteInvoiceAction(id: string) {
  return await deleteInvoice(id);
}

// INVOICE ITEMS

export async function getInvoiceItemsAction() {
  return await getInvoiceItems();
}

export async function getInvoiceItemByIdAction(id: string) {
  return await getInvoiceItemById(id);
}

export async function createInvoiceItemAction(invoiceItem: NewInvoiceItems) {
  const validatedData = invoiceItemSchema.parse(invoiceItem);

  return await createInvoiceItem(validatedData);
}

export async function updateInvoiceItemAction(
  id: string,
  invoiceItem: Partial<NewInvoiceItems>
) {
  const validatedData = invoiceItemSchema.partial().parse(invoiceItem);

  return await updateInvoiceItem(validatedData, id);
}

export async function deleteInvoiceItemAction(id: string) {
  return await deleteInvoiceItem(id);
}

// PAYMENTS

export async function getPaymentsAction() {
  return await getPayments();
}

export async function getPaymentByIdAction(id: string) {
  return await getPaymentById(id);
}

export async function getPaymentsByInvoiceIdAction(invoiceId: string) {
  return await getPaymentsByInvoiceId(invoiceId);
}

export async function createPaymentAction(payment: NewPayment) {
  const validatedData = paymentSchema.parse(payment);

  return await createPayment(validatedData);
}

export async function updatePaymentAction(
  id: string,
  payment: Partial<NewPayment>
) {
  const validatedData = paymentSchema.partial().parse(payment);

  return await updatePayment(validatedData, id);
}

export async function deletePaymentAction(id: string) {
  return await deletePayment(id);
}
