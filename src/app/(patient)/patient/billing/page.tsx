import { Card } from "@/components/ui/card";
<<<<<<< Updated upstream

export default function PatientBillingPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Billing & Statements</h1>
      <p className="mt-1 text-sm text-slate-500">View payment history and outstanding invoices.</p>
      <div className="mt-6">
        <Card label="Balance Due" value="$0.00" hint="Wired up in feature update" />
=======

import BillingTable from "@/features/billing/component/billing-table";

import { getPatientInvoices } from "@/features/billing/queries";
import { getPaymentsByInvoiceIdAction } from "@/features/billing/actions";

import { createClient } from "@/lib/supabase/server";

export default async function PatientBillingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const invoices = await getPatientInvoices(user.id);

  // Get payments for all patient invoices
  const paymentsByInvoice = await Promise.all(
    invoices.map(async (invoice) => {
      const payments = await getPaymentsByInvoiceIdAction(invoice.id);

      return {
        invoiceId: invoice.id,
        payments,
      };
    })
  );

  // Calculate current outstanding balance
  const currentBalance = invoices.reduce((balance, invoice) => {
    const invoicePayments =
      paymentsByInvoice.find(
        (item) => item.invoiceId === invoice.id
      )?.payments ?? [];

    // Only successful payments count
    const totalPaid = invoicePayments
      .filter(
        (payment) =>
          String(payment.payment_status).toLowerCase() === "success"
      )
      .reduce(
        (sum, payment) => sum + Number(payment.amount_paid || 0),
        0
      );

    const invoiceTotal = Number(invoice.total || 0);

    const remaining = Math.max(invoiceTotal - totalPaid, 0);

    return balance + remaining;
  }, 0);

  return (
    <div className="w-full min-w-0 max-w-full">
      {/* HEADER */}
      <div className="mb-6 w-full min-w-0">
        <h1
          className="
            text-xl
            font-semibold
            text-[#0A1B39]
            dark:text-white
            sm:text-2xl
          "
        >
          Billing & Statements
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-slate-500
            dark:text-slate-400
          "
        >
          View payment history and outstanding invoices.
        </p>
      </div>

      {/* BALANCE CARD */}
      <div className="w-full min-w-0 sm:max-w-sm">
        <Card
          label="Balance Due"
          value={`$${currentBalance.toFixed(2)}`}
          hint={
            currentBalance > 0
              ? "Outstanding amount"
              : "No outstanding balance"
          }
        />
      </div>

      {/* BILLING TABLE */}
      <div className="mt-6 w-full min-w-0 max-w-full">
        <BillingTable invoices={invoices} isPatient={true} />
>>>>>>> Stashed changes
      </div>
    </div>
  );
}
