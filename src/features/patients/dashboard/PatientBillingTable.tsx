
"use client";

import Link from "next/link";
import Table from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type PatientBillingTableProps = {
  invoices: any[];
};

export default function PatientBillingTable({
  invoices,
}: PatientBillingTableProps) {
  const columns = [
    {
      key: "invoice_number",
      label: "Invoice ID",
    },

    {
      key: "issued_date",
      label: "Issued Date",
      render: (row: any) =>
        row.issued_date
          ? new Date(row.issued_date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-",
    },

    {
      key: "total",
      label: "Amount",
      render: (row: any) => (
        <span className="font-semibold text-[#0A1B39] dark:text-white">
          ${Number(row.total || 0).toFixed(2)}
        </span>
      ),
    },

    {
      key: "status",
      label: "Status",
      render: (row: any) => {
        if (row.status === "paid") {
          return <Badge color="green">Paid</Badge>;
        }

        if (row.status === "partially_paid") {
          return <Badge color="yellow">Partially Paid</Badge>;
        }

        return <Badge color="red">Unpaid</Badge>;
      },
    },

    {
      key: "action",
      label: "",
      render: (row: any) => (
        <Link
          href={`/patient/billing/${row.id}`}
          className="text-sm font-medium text-[#2E37A4] hover:underline"
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-5 text-base font-bold text-[#0A1B39] dark:text-white">
        My Billing
      </h2>

      {invoices.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          No billing records found.
        </p>
      ) : (
        <Table columns={columns} data={invoices} />
      )}
    </div>
  );
}

