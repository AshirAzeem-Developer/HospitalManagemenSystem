"use client";

import Table from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dropdown } from "@/components/ui/select";
import PaginationControls from "@/components/ui/PaginationControls";
import { deletePaymentAction } from "../actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PaymentsTableProps = {
  payments: any[];
  invoiceNumber?: string;
};

export default function PaymentsTable({
  payments,
  invoiceNumber,
}: PaymentsTableProps) {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const getPaymentDate = (row: any) => {
    if (!row?.payment_date) return "-";

    return new Date(row.payment_date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPaymentMethod = (row: any) => {
    if (!row?.payment_method) return "-";

    return String(row.payment_method)
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getPaymentStatus = (row: any) => {
    const status = String(row?.payment_status || "").toLowerCase();

    switch (status) {
      case "paid":
      case "success":
      case "successful":
        return <Badge color="green">Paid</Badge>;

      case "pending":
        return <Badge color="yellow">Pending</Badge>;

      case "failed":
        return <Badge color="red">Failed</Badge>;

      case "partially_paid":
      case "partial":
        return <Badge color="yellow">Partially Paid</Badge>;

      default:
        return (
          <Badge color="red">
            {status || "Unknown"}
          </Badge>
        );
    }
  };

  const columns = [
    {
      key: "invoice_number",
      label: "Invoice ID",

      render: (row: any) => (
        <span className="text-sm font-medium text-[#0A1B39]">
          {row?.invoices?.invoice_number || invoiceNumber || "-"}
        </span>
      ),
    },

    {
      key: "payment_date",
      label: "Paid Date",

      render: (row: any) => (
        <span className="text-sm text-gray-600">
          {getPaymentDate(row)}
        </span>
      ),
    },

    {
      key: "amount_paid",
      label: "Amount",

      render: (row: any) => (
        <span className="text-sm font-semibold text-[#0A1B39]">
          ${Number(row?.amount_paid || 0).toFixed(2)}
        </span>
      ),
    },

    {
      key: "payment_method",
      label: "Payment Method",

      render: (row: any) => (
        <span className="text-sm text-gray-600">
          {getPaymentMethod(row)}
        </span>
      ),
    },

    {
      key: "payment_status",
      label: "Status",

      render: (row: any) => getPaymentStatus(row),
    },

    {
      key: "reference_number",
      label: "Reference",

      render: (row: any) => (
        <span className="text-sm text-gray-500">
          {row?.reference_number || "-"}
        </span>
      ),
    },

    {
      key: "action",
      label: "",

      render: (row: any) => (
        <Dropdown>
          <Dropdown.Trigger
            className="
              ml-auto
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-md
              border
              border-[#E7E8EB]
              bg-white
              text-gray-500
              hover:bg-gray-50
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

                if (!confirmed) return;

                try {
                  await deletePaymentAction(row.id);

                  router.refresh();
                } catch (error) {
                  console.error(
                    "DELETE PAYMENT ERROR:",
                    error
                  );
                }
              }}
            >
              Delete
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      ),
    },
  ];

  const totalPages = Math.max(
    1,
    Math.ceil(payments.length / limit)
  );

  const currentPage = Math.min(page, totalPages);

  const start = (currentPage - 1) * limit;

  const end = start + limit;

  const paginatedPayments = payments.slice(
    start,
    end
  );

  if (payments.length === 0) {
    return (
      <div className="rounded-lg border border-[#E7E8EB] bg-white">
        <div className="px-4 py-10 text-center">
          <p className="text-sm font-medium text-[#0A1B39]">
            No payments found
          </p>

          <p className="mt-1 text-sm text-gray-400">
            No payment has been recorded for this invoice.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#E7E8EB] bg-white">
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          data={paginatedPayments}
        />
      </div>

      {totalPages > 1 && (
        <div className="border-t border-[#E7E8EB] px-4 py-2">
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
      )}
    </div>
  );
}