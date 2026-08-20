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
import { useState } from "react";

export type DepartmentDatum = {
  department: string;
  current: number;
  previous: number;
};

type ConsultationByDepartmentProps = {
  departmentData: DepartmentDatum[];
  period?: string;
  periods?: string[];
  onPeriodChange?: (period: string) => void;
};

export default function ConsultationByDepartment({
  departmentData,
  period = "Monthly",
  periods = ["Weekly", "Monthly", "Yearly"],
  onPeriodChange,
}: ConsultationByDepartmentProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    onPeriodChange?.(value);
  };

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-bold text-slate-900">
          Consultation By Department
        </h2>

        <select
          value={selectedPeriod}
          onChange={(e) => handlePeriodChange(e.target.value)}
          className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 focus:outline-none"
        >
          {periods.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="h-[260px] w-full sm:h-[320px]">
        {departmentData.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-500">
              No consultation data found.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={departmentData}
              layout="vertical"
              margin={{
                top: 0,
                right: 16,
                left: 0,
                bottom: 0,
              }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />

              <XAxis
                type="number"
                domain={[0, "dataMax"]}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                tick={{ fontSize: 11 }}
              />

              {/* Y-axis shows doctor specialization (department) */}
              <YAxis
                type="category"
                dataKey="department"
                tickLine={false}
                axisLine={false}
                width={110}
                tick={{ fontSize: 12 }}
              />

              <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} />

              <Bar
                dataKey="current"
                fill="#2E37A4"
                radius={[4, 4, 4, 4]}
                barSize={12}
              />

              <Bar
                dataKey="previous"
                fill="#2FBFA0"
                radius={[4, 4, 4, 4]}
                barSize={12}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}