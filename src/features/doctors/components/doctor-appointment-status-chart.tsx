"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type AppointmentStats = {
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
};

type Props = {
  stats: AppointmentStats;
};

const COLORS = [
  "#F59E0B",
  "#3B82F6",
  "#10B981",
  "#EF4444",
];

export default function DoctorAppointmentStatusChart({
  stats,
}: Props) {
  const data = [
    {
      name: "Pending",
      value: stats.pending,
    },
    {
      name: "Confirmed",
      value: stats.confirmed,
    },
    {
      name: "Completed",
      value: stats.completed,
    },
    {
      name: "Cancelled",
      value: stats.cancelled,
    },
  ];

  const total = data.reduce(
    (sum, item) => sum + item.value,
    0,
  );

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
      {/* Header */}
      <div className="mb-4">
        <h2
          className="
            text-lg font-semibold
            text-[#0A1B39]
            dark:text-[#F1F5F9]
          "
        >
          Appointment Status
        </h2>

        <p
          className="
            mt-1 text-sm
            text-[#667085]
            dark:text-[#94A3B8]
          "
        >
          Overview of your appointment statuses
        </p>
      </div>

      {total === 0 ? (
        <div className="flex h-[300px] items-center justify-center">
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
        <>
          {/* Pie Chart */}
          <div className="relative h-[280px] w-full sm:h-[300px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index]}
                    />
                  ))}
                </Pie>

                <Tooltip
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
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Total */}
            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-[45%]
                flex
                -translate-x-1/2
                -translate-y-1/2
                flex-col
                items-center
              "
            >
              <span
                className="
                  text-2xl font-bold
                  text-[#0A1B39]
                  dark:text-[#F1F5F9]
                "
              >
                {total}
              </span>

              <span
                className="
                  text-xs
                  text-[#667085]
                  dark:text-[#94A3B8]
                "
              >
                Total
              </span>
            </div>
          </div>

          {/* Responsive Legend */}
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
            {data.map((item, index) => (
              <div
                key={item.name}
                className="flex min-w-0 items-center justify-center gap-2"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor: COLORS[index],
                  }}
                />

                <span
                  className="
                    truncate
                    text-xs
                    font-medium
                    text-[#667085]
                    dark:text-[#CBD5E1]
                    sm:text-sm
                  "
                >
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}