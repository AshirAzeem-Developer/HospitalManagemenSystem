"use client";

import Link from "next/link";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

import PaymentsTable from "@/features/billing/component/payments-table";
import PaymentForm from "./payment-form";

import type { Invoice, InvoiceItems, Payment } from "../types";

type InvoiceDetailProps = {
  invoice: Invoice;
  items: InvoiceItems[];
  payments: Payment[];
  isPatient?: boolean;
};

export default function InvoiceDetail({
  invoice,
  items,
  payments,
  isPatient = false,
}: InvoiceDetailProps) {
  const patientName =
    invoice?.patients?.profiles?.full_name || "Unknown Patient";

  const formatDate = (date: string | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number | string | null) => {
    return Number(amount || 0).toFixed(2);
  };

  // INVOICE STATUS
  const getStatus = () => {
    switch (invoice?.status) {
      case "paid":
        return {
          text: "Paid",
          color: "green" as const,
        };

      case "partially_paid":
        return {
          text: "Partially Paid",
          color: "yellow" as const,
        };

      default:
        return {
          text: "Unpaid",
          color: "red" as const,
        };
    }
  };

  const status = getStatus();

  // SUCCESSFUL PAYMENTS ONLY
  const successfulPayments = payments.filter(
    (payment) => payment.payment_status === "success"
  );

  const totalPaid = successfulPayments.reduce(
    (sum, payment) => sum + Number(payment.amount_paid || 0),
    0
  );

  // INVOICE TOTAL
  const invoiceTotal = Number(invoice?.total || 0);

  const remainingAmount = Math.max(0, invoiceTotal - totalPaid);

  // TAX / DISCOUNT
  const subtotal = Number(invoice?.subtotal || 0);

  const taxPercentage = Number(invoice?.tax_percentage || 0);

  const discountPercentage = Number(invoice?.discount || 0);

  const taxAmount = (subtotal * taxPercentage) / 100;

  const discountAmount = (subtotal * discountPercentage) / 100;

  // PRINT
  const handlePrint = () => {
    window.print();
  };

  // DOWNLOAD
  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="w-full px-3 text-[#0A1B39] dark:text-white sm:px-4 lg:px-0">
      {/* HEADER */}

      <div className="mb-6 flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <Link
            href={isPatient ? "/patient/billing" : "/admin/billing"}
            className="
              mb-3
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-gray-600
              transition-colors
              hover:text-[#2E37A4]
              dark:text-slate-300
              dark:hover:text-indigo-400
              sm:text-base
            "
          >
            <ArrowLeft size={18} strokeWidth={2} />

            <span>Invoices</span>
          </Link>

          <h1
            className="
              text-xl
              font-semibold
              text-[#0A1B39]
              dark:text-white
              sm:text-2xl
            "
          >
            Invoice Details
          </h1>
        </div>
      </div>

      {/* INVOICE CARD */}

      <div
        id="invoice"
        className="
          mx-auto
          w-full
          max-w-6xl
          overflow-hidden
          rounded-xl
          border
          border-[#E7E8EB]
          bg-white
          shadow-sm
          dark:border-slate-700
          dark:bg-slate-900
        "
      >
        {/* TOP HEADER */}

        <div
          className="
            flex
            flex-col
            gap-3
            px-4
            py-3
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-6
            sm:py-3
            lg:px-8
            lg:py-4
          "
        >
          {/* LOGO */}

          <div className="flex items-center">
            <img
              src="/Images/LogoLightTheme.png"
              alt="SafeHeal"
              className="
                block
                h-14
                w-auto
                max-w-[220px]
                object-contain
                dark:hidden
                sm:h-16
                sm:max-w-[240px]
                lg:h-[72px]
                lg:max-w-[260px]
              "
            />

            <img
              src="/Images/DarkTheme.png"
              alt="SafeHeal"
              className="
                hidden
                h-14
                w-auto
                max-w-[220px]
                object-contain
                dark:block
                sm:h-16
                sm:max-w-[240px]
                lg:h-[72px]
                lg:max-w-[260px]
              "
            />
          </div>

          {/* STATUS */}

          <div className="w-fit">
            <Badge color={status.color}>{status.text}</Badge>
          </div>
        </div>

        {/* INVOICE DETAILS */}

        <div
          className="
            grid
            grid-cols-1
            gap-6
            border-t
            border-[#E7E8EB]
            px-4
            py-6
            dark:border-slate-700
            sm:grid-cols-2
            sm:px-6
            lg:grid-cols-3
            lg:gap-10
            lg:px-8
            lg:py-7
          "
        >
          {/* INVOICE INFORMATION */}

          <div className="min-w-0">
            <h2 className="mb-4 text-base font-semibold text-[#0A1B39] dark:text-white">
              Invoice Details
            </h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                <span className="text-gray-500 dark:text-slate-400">
                  Invoice Number:
                </span>

                <span className="break-all font-medium text-[#0A1B39] dark:text-slate-100">
                  {invoice?.invoice_number || "-"}
                </span>
              </div>

              <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                <span className="text-gray-500 dark:text-slate-400">
                  Issued On:
                </span>

                <span className="font-medium text-[#0A1B39] dark:text-slate-100">
                  {formatDate(invoice?.issued_date)}
                </span>
              </div>

              <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                <span className="text-gray-500 dark:text-slate-400">
                  Due Date:
                </span>

                <span className="font-medium text-[#0A1B39] dark:text-slate-100">
                  {formatDate(invoice?.due_date)}
                </span>
              </div>

              <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                <span className="text-gray-500 dark:text-slate-400">
                  Status:
                </span>

                <span className="font-medium text-[#0A1B39] dark:text-slate-100">
                  {status.text}
                </span>
              </div>
            </div>
          </div>

          {/* INVOICE FROM */}

          <div className="min-w-0">
            <h2 className="mb-4 text-base font-semibold text-[#0A1B39] dark:text-white">
              Invoice From
            </h2>

            <div className="text-sm leading-6 text-gray-500 dark:text-slate-400">
              <p className="font-semibold text-[#0A1B39] dark:text-white">
                Preclinic
              </p>

              <p>Hospital Management System</p>
            </div>
          </div>

          {/* INVOICE TO */}

          <div className="min-w-0">
            <h2 className="mb-4 text-base font-semibold text-[#0A1B39] dark:text-white">
              Invoice To
            </h2>

            <div className="text-sm leading-6 text-gray-500 dark:text-slate-400">
              <p className="break-words font-semibold text-[#0A1B39] dark:text-white">
                {patientName}
              </p>

              <p>Patient</p>
            </div>
          </div>
        </div>

        {/* PRODUCTS / SERVICES */}

        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-base font-semibold text-[#0A1B39] dark:text-white">
            Products/Service Items
          </h2>

          <div
            className="
              w-full
              overflow-x-auto
              rounded-md
              border
              border-[#E7E8EB]
              dark:border-slate-700
            "
          >
            <table className="w-full min-w-[750px] border-collapse">
              <thead>
                <tr className="bg-[#F4F5F7] dark:bg-slate-800">
                  <th className="w-12 px-4 py-3.5 text-center text-sm font-semibold text-[#0A1B39] dark:text-slate-100">
                    #
                  </th>

                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-[#0A1B39] dark:text-slate-100">
                    Product/Item
                  </th>

                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-[#0A1B39] dark:text-slate-100">
                    Description
                  </th>

                  <th className="px-4 py-3.5 text-right text-sm font-semibold text-[#0A1B39] dark:text-slate-100">
                    Unit Cost
                  </th>

                  <th className="px-4 py-3.5 text-center text-sm font-semibold text-[#0A1B39] dark:text-slate-100">
                    Quantity
                  </th>

                  <th className="px-4 py-3.5 text-right text-sm font-semibold text-[#0A1B39] dark:text-slate-100">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <tr
                      key={item.id ?? index}
                      className="
                        border-t
                        border-[#E7E8EB]
                        dark:border-slate-700
                      "
                    >
                      <td className="px-4 py-4 text-center text-sm text-gray-600 dark:text-slate-300">
                        {index + 1}
                      </td>

                      <td className="px-4 py-4 text-sm font-medium text-[#0A1B39] dark:text-slate-100">
                        {item.item_name}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-slate-400">
                        {item.description || "-"}
                      </td>

                      <td className="px-4 py-4 text-right text-sm text-gray-600 dark:text-slate-300">
                        ${formatAmount(item.unit_cost)}
                      </td>

                      <td className="px-4 py-4 text-center text-sm text-gray-600 dark:text-slate-300">
                        {item.quantity}
                      </td>

                      <td className="px-4 py-4 text-right text-sm font-medium text-[#0A1B39] dark:text-slate-100">
                        ${formatAmount(item.amount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-sm text-gray-500 dark:text-slate-400"
                    >
                      No invoice items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TERMS + TOTAL */}

        <div
          className="
            grid
            grid-cols-1
            gap-8
            border-t
            border-[#E7E8EB]
            px-4
            py-6
            dark:border-slate-700
            sm:px-6
            lg:grid-cols-2
            lg:gap-12
            lg:px-8
            lg:py-7
          "
        >
          {/* TERMS */}

          <div>
            <h2 className="mb-3 text-sm font-semibold text-[#0A1B39] dark:text-white">
              Terms and Conditions
            </h2>

            <p className="text-sm leading-6 text-gray-500 dark:text-slate-400">
              The payment must be returned in the same condition.
            </p>
          </div>

          {/* TOTAL */}

          <div className="w-full lg:ml-auto lg:max-w-sm">
            <div className="space-y-3 text-sm">
              {taxPercentage > 0 && (
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-slate-400">
                    Tax ({taxPercentage}%)
                  </span>

                  <span className="font-medium text-[#0A1B39] dark:text-slate-100">
                    ${formatAmount(taxAmount)}
                  </span>
                </div>
              )}

              {discountPercentage > 0 && (
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-slate-400">
                    Discount ({discountPercentage}%)
                  </span>

                  <span className="font-medium text-red-500 dark:text-red-400">
                    -${formatAmount(discountAmount)}
                  </span>
                </div>
              )}

              <div
                className="
                  mt-4
                  flex
                  justify-between
                  gap-4
                  border-t
                  border-[#E7E8EB]
                  pt-4
                  dark:border-slate-700
                "
              >
                <span className="text-base font-semibold text-[#0A1B39] dark:text-white">
                  Total
                </span>

                <span className="text-lg font-bold text-[#0A1B39] dark:text-white">
                  ${formatAmount(invoice?.total)}
                </span>
              </div>

              {/* PAYMENT SUMMARY */}

              <div
                className="
                  mt-5
                  border-t
                  border-[#E7E8EB]
                  pt-4
                  dark:border-slate-700
                "
              >
                <div className="space-y-3">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500 dark:text-slate-400">
                      Paid Amount
                    </span>

                    <span className="font-semibold text-green-600 dark:text-green-400">
                      ${totalPaid.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500 dark:text-slate-400">
                      Remaining
                    </span>

                    <span className="font-semibold text-red-600 dark:text-red-400">
                      ${remainingAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <div className="border-t border-[#E7E8EB] px-4 py-5 dark:border-slate-700 sm:px-8">
          <p className="text-center text-sm text-gray-400 dark:text-slate-500">
            Thank you for choosing our hospital.
          </p>
        </div>
      </div>

      {/* PAYMENT FORM - ADMIN ONLY */}

      {!isPatient && (
        <div className="mx-auto mt-6 w-full max-w-6xl">
          <PaymentForm
            invoiceId={invoice.id}
            invoiceTotal={invoiceTotal}
            paidAmount={totalPaid}
          />
        </div>
      )}

      {/* PAYMENTS */}

      <div className="mx-auto mt-6 w-full max-w-6xl">
        <div
          className="
            mb-4
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-[#0A1B39] dark:text-white">
              Payments
            </h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
              Payment history for invoice{" "}
              <span className="font-medium text-[#0A1B39] dark:text-slate-200">
                {invoice?.invoice_number || "-"}
              </span>
            </p>
          </div>

          <span
            className="
              w-fit
              shrink-0
              rounded
              border
              border-[#2E37A4]
              bg-[#EEF2FF]
              px-2
              py-1
              text-[15px]
              font-medium
              text-[#2E37A4]
              dark:border-indigo-500/40
              dark:bg-indigo-500/10
              dark:text-indigo-300
            "
          >
            Total Payments: {payments.length}
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          <PaymentsTable
            payments={payments}
            invoiceNumber={invoice?.invoice_number ?? undefined}
            isPatient={isPatient}
          />
        </div>
      </div>

      {/* BUTTONS */}

      <div
        className="
          mt-6
          flex
          w-full
          flex-col
          justify-center
          gap-3
          sm:flex-row
        "
      >
        <Button variant="ghost" text="Print" onClick={handlePrint} />

        <Button variant="primary" text="Download" onClick={handleDownload} />
      </div>
    </div>
  );
}
