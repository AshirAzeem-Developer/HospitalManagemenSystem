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
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#0A1B39]">
          Monthly Appointments
        </h2>

        <p className="mt-1 text-sm text-[#667085]">
          Your appointments over the last 6 months
        </p>
      </div>

      {total === 0 ? (
        <div className="flex h-[320px] items-center justify-center">
          <p className="text-sm text-gray-500">
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
              />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
                formatter={(value) => [
                  `${value}`,
                  "Appointments",
                ]}
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