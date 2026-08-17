"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Image from "next/image";
import { useState } from "react";

/* ---------------- Types ---------------- */

type DepartmentDatum = {
  department: string;
  current: number;
  previous: number;
};

type Transaction = {
  id: string;
  doctor_name: string;
  specialty: string;
  amount: number;
  avatar_url?: string | null;
  status: "success" | "failed" | "pending";
};

/* ---------------- Consultation By Department ---------------- */

type ConsultationByDepartmentProps = {
  data: DepartmentDatum[];
  period?: string;
  periods?: string[];
  onPeriodChange?: (period: string) => void;
};

export function ConsultationByDepartment({
  data,
  period = "Monthly",
  periods = ["Weekly", "Monthly", "Yearly"],
  onPeriodChange,
}: ConsultationByDepartmentProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">
          Consultation By Department
        </h2>

        <select
          value={period}
          onChange={(e) => onPeriodChange?.(e.target.value)}
          className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 focus:outline-none"
        >
          {periods.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="department"
              tickLine={false}
              axisLine={false}
              width={90}
            />
            <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} />
            <Bar dataKey="current" fill="#2E37A4" radius={[4, 4, 4, 4]} barSize={10} />
            <Bar dataKey="previous" fill="#2FBFA0" radius={[4, 4, 4, 4]} barSize={10} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ---------------- Recent Transactions ---------------- */

type RecentTransactionsProps = {
  transactions: Transaction[];
  period?: string;
  periods?: string[];
  onPeriodChange?: (period: string) => void;
};

const statusStyles: Record<Transaction["status"], string> = {
  success: "bg-[#F4FBF7] text-[#27AE60] border border-[#27AE60]",
  failed: "bg-[#FEF4F4] text-[#EF1E1E] border border-[#EF1E1E]",
  pending: "bg-[#FEFBF5] text-[#E2B93B] border border-[#E2B93B]",
};

const statusLabel: Record<Transaction["status"], string> = {
  success: "Success",
  failed: "Failed",
  pending: "Pending",
};

export function RecentTransactions({
  transactions,
  period = "Weekly",
  periods = ["Weekly", "Monthly", "Yearly"],
  onPeriodChange,
}: RecentTransactionsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">
          Recent Transactions
        </h2>

        <select
          value={period}
          onChange={(e) => onPeriodChange?.(e.target.value)}
          className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 focus:outline-none"
        >
          {periods.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[560px] divide-y divide-slate-100">
          {transactions.length === 0 && (
            <p className="py-6 text-center text-sm text-slate-500">
              No transactions found.
            </p>
          )}

          {transactions.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100">
                  {t.avatar_url ? (
                    <Image
                      src={t.avatar_url}
                      alt={t.doctor_name}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {t.doctor_name}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {t.specialty}
                  </p>
                </div>
              </div>

              <div className="min-w-[150px] shrink-0">
                <p className="text-sm font-semibold text-slate-900">
                  Consultation Fees
                </p>
                <p className="text-sm text-slate-500">
                  ${t.amount.toLocaleString()}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[t.status]}`}
              >
                {statusLabel[t.status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Wrapper (side-by-side layout) ---------------- */

export default function ConsultationDashboard({
  departmentData,
  transactions,
}: {
  departmentData: DepartmentDatum[];
  transactions: Transaction[];
}) {
  const [deptPeriod, setDeptPeriod] = useState("Monthly");
  const [txnPeriod, setTxnPeriod] = useState("Weekly");

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ConsultationByDepartment
        data={departmentData}
        period={deptPeriod}
        onPeriodChange={setDeptPeriod}
      />
      <RecentTransactions
        transactions={transactions}
        period={txnPeriod}
        onPeriodChange={setTxnPeriod}
      />
    </div>
  );
}