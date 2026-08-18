"use client";

import Image from "next/image";
import { useState } from "react";
import { UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type Transaction = {
  id: string;
  invoice_number?: string;
  doctor_name: string;
  specialty?: string | null;
  label?: string;
  amount: number;
  avatar_url?: string | null;
  status: string; // "paid" | "partially_paid" | "unpaid" | ...
};

type RecentTransactionsProps = {
  transactions: Transaction[];
  period?: string;
  periods?: string[];
  onPeriodChange?: (period: string) => void;
  currency?: string;
};

function getStatusColor(
  status: string
): "green" | "yellow" | "blue" | "red" {
  switch (status) {
    case "paid":
      return "green";
    case "partially_paid":
      return "yellow";
    case "unpaid":
    case "pending":
      return "blue";
    case "overdue":
    case "cancelled":
    case "failed":
      return "red";
    default:
      return "blue";
  }
}

function getStatusLabel(status: string): string {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function RecentTransactions({
  transactions,
  period,
  periods = ["Weekly", "Monthly", "Yearly"],
  onPeriodChange,
  currency = "Rs. ",
}: RecentTransactionsProps) {
  const [internalPeriod, setInternalPeriod] = useState(
    period || periods[0]
  );

  const activePeriod = period ?? internalPeriod;

  const handlePeriodChange = (value: string) => {
    setInternalPeriod(value);
    onPeriodChange?.(value);
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-slate-900">
          Recent Transactions
        </h2>

        <select
          value={activePeriod}
          onChange={(e) => handlePeriodChange(e.target.value)}
          className="shrink-0 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#2E37A4]"
        >
          {periods.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-10">
          <p className="text-sm text-slate-500">No transactions found.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              {/* Avatar + name */}
              <div className="flex min-w-0 items-center gap-3">
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-400">
                  {t.avatar_url ? (
                    <Image
                      src={t.avatar_url}
                      alt={t.doctor_name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  ) : (
                    <UserRound size={18} />
                  )}
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {t.doctor_name}
                  </p>
                  {t.specialty && (
                    <p className="truncate text-xs text-slate-500">
                      {t.specialty}
                    </p>
                  )}
                </div>
              </div>

              {/* Amount + status */}
              <div className="flex items-center justify-between gap-3 pl-[52px] sm:pl-0">
                <div className="min-w-0 sm:w-[150px]">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {t.label || "Invoice"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {currency}
                    {t.amount.toLocaleString()}
                  </p>
                </div>

                <div className="shrink-0">
                  <Badge color={getStatusColor(t.status)} type="light">
                    {getStatusLabel(t.status)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}