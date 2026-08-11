
"use server";

import type {
  NewInvoice,
  NewInvoiceItems,
  NewPayment,
} from "./types";

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
  getPaymentsByInvoiceId
} from "./queries";

import {
  invoiceSchema,
  invoiceItemSchema,
  paymentSchema,
} from "./schema";


// INVOICE

export async function getInvoicesAction() {
  return await getInvoices();
}

export async function getInvoiceItemsByInvoiceIdAction(
  invoiceId: string
) {
  return await getInvoiceItemsByInvoiceId(invoiceId);
}

export async function getInvoiceByIdAction(id: string) {
  return await getInvoiceById(id);
}

export async function createInvoiceAction(
  invoice: NewInvoice
) {
  const validatedData = invoiceSchema.parse(invoice);

  return await createInvoice(validatedData);
}

export async function updateInvoiceAction(
  id: string,
  invoice: Partial<NewInvoice>
) {
  const validatedData = invoiceSchema.partial().parse(invoice);

  return await updateInvoice(validatedData, id);
}

export async function deleteInvoiceAction(id: string) {
  return await deleteInvoice(id);
}


// INVOICE ITEMS

export async function getInvoiceItemsAction() {
  return await getInvoiceItems();
}

export async function getInvoiceItemByIdAction(
  id: string
) {
  return await getInvoiceItemById(id);
}

export async function createInvoiceItemAction(
  invoiceItem: NewInvoiceItems
) {
  const validatedData =
    invoiceItemSchema.parse(invoiceItem);

  return await createInvoiceItem(validatedData);
}

export async function updateInvoiceItemAction(
  id: string,
  invoiceItem: Partial<NewInvoiceItems>
) {
  const validatedData =
    invoiceItemSchema.partial().parse(invoiceItem);

  return await updateInvoiceItem(validatedData, id);
}

export async function deleteInvoiceItemAction(
  id: string
) {
  return await deleteInvoiceItem(id);
}


// PAYMENT

export async function getPaymentsAction() {
  return await getPayments();
}

export async function getPaymentByIdAction(
  id: string
) {
  return await getPaymentById(id);
}

export async function getPaymentsByInvoiceIdAction(
    invoiceId: string
  ) {
    return await getPaymentsByInvoiceId(invoiceId);
  }
  

export async function createPaymentAction(
  payment: NewPayment
) {
  const validatedData =
    paymentSchema.parse(payment);

  return await createPayment(validatedData);
}

export async function updatePaymentAction(
  id: string,
  payment: Partial<NewPayment>
) {
  const validatedData =
    paymentSchema.partial().parse(payment);

  return await updatePayment(validatedData, id);
}

export async function deletePaymentAction(
  id: string
) {
  return await deletePayment(id);
}