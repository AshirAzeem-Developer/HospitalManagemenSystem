"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type MonthlyAppointment = {
  month: string;
  count: number;
};

type Props = {
  data: MonthlyAppointment[];
};

export default function DoctorMonthlyAppointmentsChart({
  data,
}: Props) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div
      className="
        rounded-xl
        border border-gray-200
        bg-white
        p-5
        shadow-sm

        dark:border-[#2A3850]
        dark:bg-[#0A162A]
        dark:shadow-none
      "
    >
      <div className="mb-4">
        <h2
          className="
            text-lg font-semibold
            text-[#0A1B39]
            dark:text-[#F1F5F9]
          "
        >
          Monthly Appointments
        </h2>

        <p
          className="
            mt-1 text-sm
            text-[#667085]
            dark:text-[#94A3B8]
          "
        >
          Your appointments over the last 6 months
        </p>
      </div>

      {total === 0 ? (
        <div className="flex h-[320px] items-center justify-center">
          <p
            className="
              text-sm
              text-gray-500
              dark:text-[#94A3B8]
            "
          >
            No appointment data available.
          </p>
        </div>
      ) : (
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -10,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "var(--muted)",
                  fontSize: 12,
                }}
              />

              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "var(--muted)",
                  fontSize: 12,
                }}
              />

              <Tooltip
                cursor={{
                  fill: "rgba(59, 130, 246, 0.08)",
                }}
                formatter={(value) => [
                  `${value}`,
                  "Appointments",
                ]}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)",
                }}
                labelStyle={{
                  color: "var(--foreground)",
                }}
                itemStyle={{
                  color: "var(--foreground)",
                }}
              />

              <Bar
                dataKey="count"
                name="Appointments"
                fill="#3B82F6"
                radius={[6, 6, 0, 0]}
                barSize={38}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}