"use client";

import Link from "next/link";
import Table from "@/components/ui/table";
import SearchBar from "@/components/ui/SearchBar";
import PaginationControls from "@/components/ui/PaginationControls";
import { Badge } from "@/components/ui/badge";
import { Dropdown } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteInvoiceAction } from "../actions";


type BillingTableProps = {
  invoices: any[];
};

export default function BillingTable({ invoices }: BillingTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const columns = [
    {
      key: "invoice_number",
      label: "Invoice ID",
    },
    {
      key: "patient",
      label: "Patient",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <img
            src={row.patients.profiles.avatar_url}
            alt={row.patients.profiles.full_name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-semibold text-[#0A1B39]">
            {row.patients.profiles.full_name}
          </span>
        </div>
      ),
    },
    {
      key: "issued_date",
      label: "Issued Date",
      render: (row: any) =>
        new Date(row.issued_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "due_date",
      label: "Due Date",
      render: (row: any) =>
        new Date(row.due_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "total",
      label: "Amount",
      render: (row: any) => (
        <span className="font-semibold text-[#0A1B39]">
          ${Number(row.total || 0).toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => {
        if (row.status === "paid") return <Badge color="green">Paid</Badge>;

        if (row.status === "partially_paid")
          return <Badge color="yellow">Partially Paid</Badge>;

        return <Badge color="red">Unpaid</Badge>;
      },
    },
    {
      key: "action",
      render: (row: any) => (
        <Dropdown>
          <Dropdown.Trigger className="flex h-8 w-8 items-center justify-center ml-1 rounded-md border border-[#E7E8EB] hover:bg-gray-50">
            ⋮
          </Dropdown.Trigger>

          <Dropdown.Content align="right">
            <Dropdown.Item
              onSelect={() => router.push(`/admin/billing/${row.id}`)}
            >
              View
            </Dropdown.Item>

            <Dropdown.Item
              onSelect={() => {
                router.push(`/admin/billing/new?edit=${row.id}`);
              }}
            >
              Edit
            </Dropdown.Item>

            <Dropdown.Item
              destructive
              onSelect={async () => {
                await deleteInvoiceAction(row.id);
                router.refresh();
              }}
            >
              Delete
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      ),
    },
  ];

  const filteredInvoices = invoices.filter((invoice) => {
    const searchMatch =
      search === "" ||
      invoice.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      invoice.patients.profiles.full_name
        .toLowerCase()
        .includes(search.toLowerCase());

    const statusMatch = status === "all" ? true : invoice.status === status;
    return statusMatch && searchMatch;
  });

  const sortedInvoices = [...filteredInvoices];
  if (sortBy === "recent") {
    sortedInvoices.sort(
      (a, b) =>
        new Date(b.issued_date).getTime() - new Date(a.issued_date).getTime()
    );
  }
  if (sortBy === "oldest") {
    sortedInvoices.sort(
      (a, b) =>
        new Date(a.issued_date).getTime() - new Date(b.issued_date).getTime()
    );
  }
  if (sortBy === "highest") {
    sortedInvoices.sort((a, b) => Number(b.total) - Number(a.total));
  }
  if (sortBy === "lowest") {
    sortedInvoices.sort((a, b) => Number(a.total) - Number(b.total));
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedInvoices = sortedInvoices.slice(start, end);

  return (
    <>
      {/* Filters */}

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-5 flex items-center justify-between">
          <SearchBar
            placeholder="Search"
            onSearch={(value: string) => {
              setSearch(value);
              setPage(1);
            }}
          />

          <div className="flex items-center gap-3">
            <Dropdown>
              <Dropdown.Trigger className="flex h-9 items-center gap-2 rounded-md border border-[#E7E8EB] bg-white px-4 text-sm text-[#0A1B39]">
                Filter
              </Dropdown.Trigger>

              <Dropdown.Content align="right">
                <Dropdown.Item onSelect={() => setStatus("all")}>
                  All
                </Dropdown.Item>

                <Dropdown.Item
                  onSelect={() => {
                    setStatus("paid");
                    setPage(1);
                  }}
                >
                  Paid
                </Dropdown.Item>

                <Dropdown.Item
                  onSelect={() => {
                    setStatus("partially_paid");
                    setPage(1);
                  }}
                >
                  Partially Paid
                </Dropdown.Item>

                <Dropdown.Item
                  onSelect={() => {
                    setStatus("unpaid");
                    setPage(1);
                  }}
                >
                  Unpaid
                </Dropdown.Item>
              </Dropdown.Content>
            </Dropdown>

            <Dropdown>
              <Dropdown.Trigger className="flex h-9 items-center gap-2 rounded-md border border-[#E7E8EB] bg-white px-4 text-sm text-[#0A1B39]">
                Sort By : {sortBy}
              </Dropdown.Trigger>

              <Dropdown.Content align="right">
                <Dropdown.Item onSelect={() => setSortBy("recent")}>
                  Recent
                </Dropdown.Item>

                <Dropdown.Item onSelect={() => setSortBy("oldest")}>
                  Oldest
                </Dropdown.Item>

                <Dropdown.Item
                  onSelect={() => {
                    setSortBy("highest");
                    setPage(1);
                  }}
                >
                  Highest Amount
                </Dropdown.Item>

                <Dropdown.Item onSelect={() => setSortBy("lowest")}>
                  Lowest Amount
                </Dropdown.Item>
              </Dropdown.Content>
            </Dropdown>
          </div>
        </div>

        {/* Table */}

        <Table columns={columns} data={paginatedInvoices} />

        <div className="mt-5">
          <PaginationControls
            page={page}
            totalPages={Math.ceil(sortedInvoices.length / limit)}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(newLimit: number) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </div>
      </div>
    </>
  );
}
