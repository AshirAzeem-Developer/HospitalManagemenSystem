"use client";

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
        <div className="flex items-center gap-3 min-w-[180px]">
          <img
            src={row.patients?.profiles?.avatar_url}
            alt={row.patients?.profiles?.full_name || "Patient"}
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />

          <span className="text-sm font-semibold text-[#0A1B39] whitespace-nowrap">
            {row.patients?.profiles?.full_name || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "issued_date",
      label: "Issued Date",
      render: (row: any) => (
        <span className="whitespace-nowrap text-[#0A1B39]">
          {new Date(row.issued_date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "due_date",
      label: "Due Date",
      render: (row: any) => (
        <span className="whitespace-nowrap text-[#0A1B39]">
          {new Date(row.due_date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "total",
      label: "Amount",
      render: (row: any) => (
        <span className="whitespace-nowrap font-semibold text-[#0A1B39]">
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
      label: "Action",
      render: (row: any) => (
        <Dropdown>
          <Dropdown.Trigger className="ml-1 flex h-8 w-8 items-center justify-center rounded-md border border-[#E7E8EB] text-[#0A1B39] hover:bg-gray-50">
            ⋮
          </Dropdown.Trigger>

          <Dropdown.Content align="right">
            <Dropdown.Item
              onSelect={() =>
                router.push(`/admin/billing/${row.id}`)
              }
            >
              View
            </Dropdown.Item>

            <Dropdown.Item
              onSelect={() => {
                router.push(
                  `/admin/billing/new?edit=${row.id}`
                );
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
    const invoiceNumber =
      invoice.invoice_number?.toLowerCase() || "";

    const patientName =
      invoice.patients?.profiles?.full_name?.toLowerCase() || "";

    const searchValue = search.toLowerCase();

    const searchMatch =
      search === "" ||
      invoiceNumber.includes(searchValue) ||
      patientName.includes(searchValue);

    const statusMatch =
      status === "all" || invoice.status === status;

    return statusMatch && searchMatch;
  });

  const sortedInvoices = [...filteredInvoices];

  if (sortBy === "recent") {
    sortedInvoices.sort(
      (a, b) =>
        new Date(b.issued_date).getTime() -
        new Date(a.issued_date).getTime()
    );
  }

  if (sortBy === "oldest") {
    sortedInvoices.sort(
      (a, b) =>
        new Date(a.issued_date).getTime() -
        new Date(b.issued_date).getTime()
    );
  }

  if (sortBy === "highest") {
    sortedInvoices.sort(
      (a, b) => Number(b.total) - Number(a.total)
    );
  }

  if (sortBy === "lowest") {
    sortedInvoices.sort(
      (a, b) => Number(a.total) - Number(b.total)
    );
  }

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedInvoices = sortedInvoices.slice(start, end);

  return (
    <div className="w-full">
      <div className="rounded-lg border border-slate-200 bg-white p-3 sm:p-4 lg:p-5">
        {/* Filters */}
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Search */}
          <div className="w-full lg:w-auto">
            <SearchBar
              placeholder="Search"
              onSearch={(value: string) => {
                setSearch(value);
                setPage(1);
              }}
            />
          </div>

          {/* Filter + Sort */}
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto">
            
            <Dropdown>
              <Dropdown.Trigger className="flex h-9 w-full items-center justify-center gap-2 rounded-md border border-[#E7E8EB] bg-white px-4 text-sm text-[#0A1B39] sm:w-auto">
                Filter
              </Dropdown.Trigger>

              <Dropdown.Content align="right">
                <Dropdown.Item
                  onSelect={() => {
                    setStatus("all");
                    setPage(1);
                  }}
                >
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
              <Dropdown.Trigger className="flex h-9 w-full items-center justify-center gap-2 rounded-md border border-[#E7E8EB] bg-white px-4 text-sm text-[#0A1B39] sm:w-auto">
                Sort By:{" "}
                <span className="capitalize">
                  {sortBy}
                </span>
              </Dropdown.Trigger>

              <Dropdown.Content align="right">
                <Dropdown.Item
                  onSelect={() => {
                    setSortBy("recent");
                    setPage(1);
                  }}
                >
                  Recent
                </Dropdown.Item>

                <Dropdown.Item
                  onSelect={() => {
                    setSortBy("oldest");
                    setPage(1);
                  }}
                >
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

                <Dropdown.Item
                  onSelect={() => {
                    setSortBy("lowest");
                    setPage(1);
                  }}
                >
                  Lowest Amount
                </Dropdown.Item>
              </Dropdown.Content>
            </Dropdown>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[850px]">
            <Table
              columns={columns}
              data={paginatedInvoices}
            />
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-5 overflow-x-auto text-[#0A1B39]">
          <PaginationControls
            page={page}
            totalPages={Math.ceil(
              sortedInvoices.length / limit
            )}
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
  );
}
