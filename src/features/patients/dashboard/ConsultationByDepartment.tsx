
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

export type DepartmentDatum = {
  department: string;
  current: number;
  previous: number;
};

type ConsultationByDepartmentProps = {
  departmentData: DepartmentDatum[];
};

export default function ConsultationByDepartment({
  departmentData,
}: ConsultationByDepartmentProps) {
  // Dynamic height: base height per department row + clamp between min/max
  const ROW_HEIGHT = 56;
  const MIN_HEIGHT = 180;
  const MAX_HEIGHT = 320;

  const chartHeight = Math.min(
    MAX_HEIGHT,
    Math.max(
      MIN_HEIGHT,
      departmentData.length * ROW_HEIGHT
    )
  );

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 sm:p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Consultation By Department
        </h2>

        {/* Fixed Monthly */}
        <span className="text-sm font-medium text-slate-500 dark:text-gray-400">
          Monthly
        </span>
      </div>

      {/* Chart */}
      <div
        className="w-full transition-[height] duration-300"
        style={{ height: `${chartHeight}px` }}
      >
        {departmentData.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-500 dark:text-gray-400">
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
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                className="stroke-slate-200 dark:stroke-gray-700"
              />

              <XAxis
                type="number"
                domain={[0, "dataMax"]}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                tick={{
                  fontSize: 11,
                  fill: "#612fbf",
                }}
              />

              {/* Doctor specialization / Department */}
              <YAxis
                type="category"
                dataKey="department"
                tickLine={false}
                axisLine={false}
                width={110}
                tick={{
                  fontSize: 12,
                  fill: "#612fbf",
                }}
              />

              <Tooltip
                cursor={{
                  fill: "rgba(0,0,0,0.03)",
                }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
                labelStyle={{
                  color: "#2FBFA0",
                  fontWeight: 600,
                }}
              />

              {/* Current Month */}
              <Bar
                dataKey="current"
                name="Current Month"
                fill="#2E37A4"
                radius={[4, 4, 4, 4]}
                barSize={12}
              />

              {/* Previous Month */}
              <Bar
                dataKey="previous"
                name="Previous Month"
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

