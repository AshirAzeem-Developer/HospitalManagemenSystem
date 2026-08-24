"use client";

import Table from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dropdown } from "@/components/ui/select";
import PaginationControls from "@/components/ui/PaginationControls";

import { deletePaymentAction } from "../actions";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Payment } from "../types";

type PaymentsTableProps = {
  payments: Payment[];
  invoiceNumber?: string;
  isPatient?: boolean;
};

export default function PaymentsTable({
  payments,
  invoiceNumber,
  isPatient = false,
}: PaymentsTableProps) {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const getPaymentDate = (row: Payment) => {
    if (!row?.payment_date) {
      return "-";
    }

    return new Date(row.payment_date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPaymentMethod = (row: Payment) => {
    if (!row?.payment_method) {
      return "-";
    }

    return String(row.payment_method)
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getPaymentStatus = (row: Payment) => {
    const status = String(row?.payment_status || "").toLowerCase();

    switch (status) {
      case "success":
        return <Badge color="green">Paid</Badge>;

      case "pending":
        return <Badge color="yellow">Pending</Badge>;

      case "failed":
        return <Badge color="red">Failed</Badge>;

      default:
        return <Badge color="red">{status || "Unknown"}</Badge>;
    }
  };

  const columns = [
    {
      key: "invoice_number",
      label: "Invoice ID",

      render: (row: Payment) => (
        <span
          className="
            block max-w-[150px]
            truncate whitespace-nowrap
            text-xs font-medium
            text-[#0A1B39]
            sm:text-sm
            dark:text-gray-100
          "
        >
          {row?.invoices?.invoice_number || invoiceNumber || "-"}
        </span>
      ),
    },

    {
      key: "payment_date",
      label: "Paid Date",

      render: (row: Payment) => (
        <span
          className="
            whitespace-nowrap
            text-xs text-[#0A1B39]
            sm:text-sm
            dark:text-gray-300
          "
        >
          {getPaymentDate(row)}
        </span>
      ),
    },

    {
      key: "amount_paid",
      label: "Amount",

      render: (row: Payment) => (
        <span
          className="
            whitespace-nowrap
            text-xs font-semibold
            text-[#0A1B39]
            sm:text-sm
            dark:text-gray-100
          "
        >
          ${Number(row?.amount_paid || 0).toFixed(2)}
        </span>
      ),
    },

    {
      key: "payment_method",
      label: "Payment Method",

      render: (row: Payment) => (
        <span
          className="
            whitespace-nowrap
            text-xs text-[#0A1B39]
            sm:text-sm
            dark:text-gray-300
          "
        >
          {getPaymentMethod(row)}
        </span>
      ),
    },

    {
      key: "payment_status",
      label: "Status",

      render: (row: Payment) => getPaymentStatus(row),
    },

    {
      key: "reference_number",
      label: "Reference",

      render: (row: Payment) => (
        <span
          title={row?.reference_number || "-"}
          className="
            block max-w-[140px]
            truncate
            text-xs text-[#0A1B39]
            sm:text-sm
            dark:text-gray-300
          "
        >
          {row?.reference_number || "-"}
        </span>
      ),
    },

    // Action - ADMIN ONLY
    ...(!isPatient
      ? [
          {
            key: "action",
            label: "",

            render: (row: Payment) => (
              <Dropdown>
                <Dropdown.Trigger
                  className="
                    ml-auto
                    flex h-8 w-8 shrink-0
                    items-center justify-center
                    rounded-md
                    border border-[#E7E8EB]
                    bg-white
                    text-[#0A1B39]
                    transition
                    hover:bg-gray-50
                    dark:border-gray-600
                    dark:bg-gray-800
                    dark:text-gray-200
                    dark:hover:bg-gray-700
                  "
                >
                  ⋮
                </Dropdown.Trigger>

                <Dropdown.Content align="right">
                  <Dropdown.Item
                    destructive
                    onSelect={async () => {
                      const confirmed = window.confirm(
                        "Are you sure you want to delete this payment?"
                      );

                      if (!confirmed) {
                        return;
                      }

                      try {
                        await deletePaymentAction(row.id);

                        router.refresh();
                      } catch (error) {
                        console.error("DELETE PAYMENT ERROR:", error);
                      }
                    }}
                  >
                    Delete
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown>
            ),
          },
        ]
      : []),
  ];

  const totalPages = Math.max(1, Math.ceil(payments.length / limit));

  const currentPage = Math.min(page, totalPages);

  const start = (currentPage - 1) * limit;

  const end = start + limit;

  const paginatedPayments = payments.slice(start, end);

  if (payments.length === 0) {
    return (
      <div
        className="
          w-full
          overflow-hidden
          rounded-lg
          border border-[#E7E8EB]
          bg-white
          dark:border-gray-700
          dark:bg-gray-800
        "
      >
        <div
          className="
            px-4 py-10
            text-center
            sm:py-12
          "
        >
          <p
            className="
              text-sm font-medium
              text-[#0A1B39]
              dark:text-white
            "
          >
            No payments found
          </p>

          <p
            className="
              mt-1
              text-xs
              text-[#0A1B39]/60
              sm:text-sm
              dark:text-gray-400
            "
          >
            No payment has been recorded for this invoice.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-lg
        border border-[#E7E8EB]
        bg-white
        shadow-sm
        dark:border-gray-700
        dark:bg-gray-800
        dark:shadow-none
      "
    >
      <div
        className="
          w-full
          overflow-x-auto
          overscroll-x-contain
        "
      >
        <div className="min-w-[750px]">
          <Table columns={columns} data={paginatedPayments} />
        </div>
      </div>

      {totalPages > 1 && (
        <div
          className="
            border-t border-[#E7E8EB]
            px-3 py-3
            sm:px-4
            dark:border-gray-700
          "
        >
          <div className="w-full overflow-x-auto">
            <div className="min-w-max">
              <PaginationControls
                page={currentPage}
                totalPages={totalPages}
                limit={limit}
                onPageChange={setPage}
                onLimitChange={(newLimit: number) => {
                  setLimit(newLimit);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


























