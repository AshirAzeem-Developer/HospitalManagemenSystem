"use client";

import Link from "next/link";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import PaymentsTable from "@/features/billing/component/payments-table";

type InvoiceDetailProps = {
  invoice: any;
  items: any[];
  payments: any[];
};

export default function InvoiceDetail({
  invoice,
  items,
  payments,
}: InvoiceDetailProps) {
  const patientName =
    invoice?.patients?.profiles?.full_name || "Unknown Patient";

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number | string) => {
    return Number(amount || 0).toFixed(2);
  };

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

      case "overdue":
        return {
          text: "Overdue",
          color: "red" as const,
        };

      case "draft":
        return {
          text: "Draft",
          color: "blue" as const,
        };

      default:
        return {
          text: "Unpaid",
          color: "red" as const,
        };
    }
  };

  const status = getStatus();

  const subtotal = Number(invoice?.subtotal || 0);

  const taxPercentage = Number(invoice?.tax_percentage || 0);

  const discountPercentage = Number(invoice?.discount || 0);

  const taxAmount = (subtotal * taxPercentage) / 100;

  const discountAmount = (subtotal * discountPercentage) / 100;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/admin/billing"
            className="mb-3 inline-flex items-center gap-2 text-base font-medium text-gray-600 hover:text-[#2E37A4]"
          >
            <ArrowLeft size={18} strokeWidth={2} />
            <span>Invoices</span>
          </Link>

          <h1 className="text-2xl font-semibold text-[#0A1B39]">
            Invoice Details
          </h1>
        </div>
      </div>

      {/* INVOICE CARD */}

      <div
        id="invoice"
        className="mx-auto max-w-6xl overflow-hidden rounded-xl border border-[#E7E8EB] bg-white shadow-sm"
      >
        {/* TOP HEADER */}

        <div className="flex items-center justify-between px-8 py-7">
          <div>
            <img
              src="/Images/logo.png"
              alt="Preclinic"
              className="h-10 w-auto object-contain"
            />
          </div>

          <div>
            <Badge color={status.color}>{status.text}</Badge>
          </div>
        </div>

        {/* INVOICE DETAILS */}

        <div className="grid grid-cols-3 gap-10 border-t border-[#E7E8EB] px-8 py-7">
          {/* INVOICE DETAILS */}

          <div>
            <h2 className="mb-4 text-base font-semibold text-[#0A1B39]">
              Invoice Details
            </h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex gap-2">
                <span className="text-gray-500">Invoice Number :</span>

                <span className="font-medium text-[#0A1B39]">
                  {invoice?.invoice_number || "-"}
                </span>
              </div>

              <div className="flex gap-2">
                <span className="text-gray-500">Issued On :</span>

                <span className="font-medium text-[#0A1B39]">
                  {formatDate(invoice?.issued_date)}
                </span>
              </div>

              <div className="flex gap-2">
                <span className="text-gray-500">Due Date :</span>

                <span className="font-medium text-[#0A1B39]">
                  {formatDate(invoice?.due_date)}
                </span>
              </div>

              <div className="flex gap-2">
                <span className="text-gray-500">Status :</span>

                <span className="font-medium text-[#0A1B39]">
                  {status.text}
                </span>
              </div>
            </div>
          </div>

          {/* INVOICE FROM */}

          <div>
            <h2 className="mb-4 text-base font-semibold text-[#0A1B39]">
              Invoice From
            </h2>

            <div className="text-sm leading-6 text-gray-500">
              <p className="font-semibold text-[#0A1B39]">Preclinic</p>

              <p>Hospital Management System</p>
            </div>
          </div>

          {/* INVOICE TO */}

          <div>
            <h2 className="mb-4 text-base font-semibold text-[#0A1B39]">
              Invoice To
            </h2>

            <div className="text-sm leading-6 text-gray-500">
              <p className="font-semibold text-[#0A1B39]">{patientName}</p>

              <p>Patient</p>
            </div>
          </div>
        </div>

        {/* PRODUCTS / SERVICES */}

        <div className="px-8 py-6">
          <h2 className="mb-4 text-base font-semibold text-[#0A1B39]">
            Products/Service Items
          </h2>

          <div className="overflow-hidden rounded-md border border-[#E7E8EB]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#F4F5F7]">
                  <th className="w-12 px-4 py-3.5 text-center text-sm font-semibold text-[#0A1B39]">
                    #
                  </th>

                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-[#0A1B39]">
                    Product/Item
                  </th>

                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-[#0A1B39]">
                    Description
                  </th>

                  <th className="px-4 py-3.5 text-right text-sm font-semibold text-[#0A1B39]">
                    Unit Cost
                  </th>

                  <th className="px-4 py-3.5 text-center text-sm font-semibold text-[#0A1B39]">
                    Quantity
                  </th>

                  <th className="px-4 py-3.5 text-right text-sm font-semibold text-[#0A1B39]">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <tr
                      key={item.id ?? index}
                      className="border-t border-[#E7E8EB]"
                    >
                      <td className="px-4 py-4 text-center text-sm text-gray-600">
                        {index + 1}
                      </td>

                      <td className="px-4 py-4 text-sm font-medium text-[#0A1B39]">
                        {item.item_name}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-500">
                        {item.description || "-"}
                      </td>

                      <td className="px-4 py-4 text-right text-sm text-gray-600">
                        ${formatAmount(item.unit_cost)}
                      </td>

                      <td className="px-4 py-4 text-center text-sm text-gray-600">
                        {item.quantity}
                      </td>

                      <td className="px-4 py-4 text-right text-sm font-medium text-[#0A1B39]">
                        ${formatAmount(item.amount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-sm text-gray-500"
                    >
                      No invoice items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 border-t border-[#E7E8EB] px-8 py-7">
          <div>
            <h2 className="mb-3 text-sm font-semibold text-[#0A1B39]">
              Terms and Conditions
            </h2>

            <p className="text-sm leading-6 text-gray-500">
              The payment must be returned in the same condition.
            </p>

            <h2 className="mb-3 mt-5 text-sm font-semibold text-[#0A1B39]">
              Notes
            </h2>

            <p className="text-sm leading-6 text-gray-500">
              All charges are final and include applicable taxes, fees and
              additional costs.
            </p>
          </div>

          <div className="ml-auto w-full max-w-sm">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>

                <span className="font-medium text-[#0A1B39]">
                  ${formatAmount(subtotal)}
                </span>
              </div>

              {taxPercentage > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax ({taxPercentage}%)</span>

                  <span className="font-medium text-[#0A1B39]">
                    ${formatAmount(taxAmount)}
                  </span>
                </div>
              )}

              {discountPercentage > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Discount ({discountPercentage}%)
                  </span>

                  <span className="font-medium text-red-500">
                    -${formatAmount(discountAmount)}
                  </span>
                </div>
              )}

              <div className="mt-4 flex justify-between border-t border-[#E7E8EB] pt-4">
                <span className="text-base font-semibold text-[#0A1B39]">
                  Total
                </span>

                <span className="text-lg font-bold text-[#0A1B39]">
                  ${formatAmount(invoice?.total)}
                </span>
              </div>

              <div className="pt-1">
                <p className="text-xs text-gray-500">Total in words</p>

                <p className="mt-1 text-xs font-medium text-[#0A1B39]">
                  {numberToWords(Number(invoice?.total || 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <div className="border-t border-[#E7E8EB] px-8 py-5">
          <p className="text-center text-sm text-gray-400">
            Thank you for choosing our hospital.
          </p>
        </div>
      </div>

      {/* //PAYMENTS */}

      <div className="mx-auto mt-6 max-w-6xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0A1B39]">Payments</h2>

            <p className="mt-1 text-xs text-gray-500">
              Payment history for invoice{" "}
              <span className="font-medium text-[#0A1B39]">
                {invoice?.invoice_number || "-"}
              </span>
            </p>
          </div>

          <span className="rounded border border-[#2E37A4] bg-[#EEF2FF] px-2 py-1 text-[15px] font-medium text-[#2E37A4]">
            Total Payments : {payments.length}
          </span>
        </div>

        <PaymentsTable
          payments={payments}
          invoiceNumber={invoice?.invoice_number}
        />
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <Button variant="ghost" text="Print" onClick={handlePrint} />

        <Button variant="primary" text="Download" onClick={handleDownload} />
      </div>
    </div>
  );
}

function numberToWords(amount: number): string {
  if (!amount) return "Zero Only";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const convert = (num: number): string => {
    if (num < 20) {
      return ones[num];
    }

    if (num < 100) {
      return (
        tens[Math.floor(num / 10)] + (num % 10 ? ` ${ones[num % 10]}` : "")
      );
    }

    if (num < 1000) {
      return (
        `${ones[Math.floor(num / 100)]} Hundred` +
        (num % 100 ? ` ${convert(num % 100)}` : "")
      );
    }

    if (num < 1000000) {
      return (
        `${convert(Math.floor(num / 1000))} Thousand` +
        (num % 1000 ? ` ${convert(num % 1000)}` : "")
      );
    }

    return amount.toFixed(2);
  };

  return `${convert(Math.floor(amount))} Only`;
}
