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
  try {
    return await getInvoicePatients();
  } catch (error) {
    console.error("GET INVOICE PATIENTS ERROR:", error);

    throw error;
  }
}

// INVOICES

export async function getInvoicesAction() {
  try {
    return await getInvoices();
  } catch (error) {
    console.error("GET INVOICES ERROR:", error);

    throw error;
  }
}

export async function getInvoiceByIdAction(id: string) {
  try {
    return await getInvoiceById(id);
  } catch (error) {
    console.error("GET INVOICE ERROR:", error);

    throw error;
  }
}

export async function createInvoiceAction(invoice: NewInvoice) {
  try {
    const validatedData = invoiceSchema.parse(invoice);

    return await createInvoice(validatedData);
  } catch (error) {
    console.error("CREATE INVOICE ERROR:", error);

    throw error;
  }
}

export async function updateInvoiceAction(
  id: string,
  invoice: Partial<NewInvoice>
) {
  try {
    const validatedData = invoiceSchema.partial().parse(invoice);

    return await updateInvoice(validatedData, id);
  } catch (error) {
    console.error("UPDATE INVOICE ERROR:", error);

    throw error;
  }
}

export async function deleteInvoiceAction(id: string) {
  try {
    return await deleteInvoice(id);
  } catch (error) {
    console.error("DELETE INVOICE ERROR:", error);

    throw error;
  }
}

// INVOICE ITEMS

export async function getInvoiceItemsAction() {
  try {
    return await getInvoiceItems();
  } catch (error) {
    console.error("GET INVOICE ITEMS ERROR:", error);

    throw error;
  }
}

export async function getInvoiceItemsByInvoiceIdAction(invoiceId: string) {
  try {
    return await getInvoiceItemsByInvoiceId(invoiceId);
  } catch (error) {
    console.error("GET INVOICE ITEMS ERROR:", error);

    throw error;
  }
}

export async function getInvoiceItemByIdAction(id: string) {
  try {
    return await getInvoiceItemById(id);
  } catch (error) {
    console.error("GET INVOICE ITEM ERROR:", error);

    throw error;
  }
}

export async function createInvoiceItemAction(invoiceItem: NewInvoiceItems) {
  try {
    const validatedData = invoiceItemSchema.parse(invoiceItem);

    return await createInvoiceItem(validatedData);
  } catch (error) {
    console.error("CREATE INVOICE ITEM ERROR:", error);

    throw error;
  }
}

export async function updateInvoiceItemAction(
  id: string,
  invoiceItem: Partial<NewInvoiceItems>
) {
  try {
    const validatedData = invoiceItemSchema.partial().parse(invoiceItem);

    return await updateInvoiceItem(validatedData, id);
  } catch (error) {
    console.error("UPDATE INVOICE ITEM ERROR:", error);

    throw error;
  }
}

export async function deleteInvoiceItemAction(id: string) {
  try {
    return await deleteInvoiceItem(id);
  } catch (error) {
    console.error("DELETE INVOICE ITEM ERROR:", error);

    throw error;
  }
}

// PAYMENTS

export async function getPaymentsAction() {
  try {
    return await getPayments();
  } catch (error) {
    console.error("GET PAYMENTS ERROR:", error);

    throw error;
  }
}

export async function getPaymentByIdAction(id: string) {
  try {
    return await getPaymentById(id);
  } catch (error) {
    console.error("GET PAYMENT ERROR:", error);

    throw error;
  }
}

export async function getPaymentsByInvoiceIdAction(invoiceId: string) {
  try {
    return await getPaymentsByInvoiceId(invoiceId);
  } catch (error) {
    console.error("GET PAYMENTS BY INVOICE ERROR:", error);

    throw error;
  }
}

export async function createPaymentAction(payment: NewPayment) {
  try {
    const validatedData = paymentSchema.parse(payment);

    return await createPayment(validatedData);
  } catch (error) {
    console.error("CREATE PAYMENT ERROR:", error);

    throw error;
  }
}

export async function updatePaymentAction(
  id: string,
  payment: Partial<NewPayment>
) {
  try {
    const validatedData = paymentSchema.partial().parse(payment);

    return await updatePayment(validatedData, id);
  } catch (error) {
    console.error("UPDATE PAYMENT ERROR:", error);

    throw error;
  }
}

export async function deletePaymentAction(id: string) {
  try {
    return await deletePayment(id);
  } catch (error) {
    console.error("DELETE PAYMENT ERROR:", error);

    throw error;
  }
}
