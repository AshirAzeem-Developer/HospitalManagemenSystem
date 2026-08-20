"use client";

import {
  CalendarDays,
  Users,
  HeartPulse,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

type Vitals = {
  blood_pressure?: string | null;
  heart_rate?: string | null;
  spo2?: string | null;
  temperature?: string | null;
  weight?: string | null;
  blood_pressure_trend?: number[];
  heart_rate_trend?: number[];
};

type StatsGridProps = {
  totalAppointments: number;
  totalConsultations: number;
  vitals?: Vitals;
};

const DEFAULT_TREND = [40, 55, 45, 62, 50, 68, 58];

function Sparkline({
  data,
  color,
}: {
  data: number[];
  color: string;
}) {
  const chartData = data.map((v, i) => ({ i, v }));

  return (
    <div className="mt-2 h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function StatCard({
  icon,
  iconBg,
  label,
  value,
  unit,
  subtitle,
  sparklineData,
  sparklineColor,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  sparklineData?: number[];
  sparklineColor?: string;
}) {
  return (
    <div className="flex w-full flex-col rounded-xl border border-slate-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 sm:p-5">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconBg}`}
        >
          {icon}
        </span>

        <p className="text-sm font-medium text-slate-600 dark:text-gray-300">
          {label}
        </p>
      </div>

      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">
          {value}
        </span>

        {unit && (
          <span className="text-xs font-medium text-slate-500 dark:text-gray-400">
            {unit}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-400 dark:text-gray-500">
          {subtitle}
        </p>
      )}

      {sparklineData && (
        <Sparkline
          data={sparklineData}
          color={sparklineColor || "#2E37A4"}
        />
      )}
    </div>
  );
}

export default function StatsGrid({
  totalAppointments,
  totalConsultations,
  vitals,
}: StatsGridProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Appointments */}
      <StatCard
        icon={<CalendarDays size={18} className="text-indigo-600" />}
        iconBg="bg-indigo-100"
        label="Total Appointments"
        value={totalAppointments}
        subtitle="All appointments"
      />

      {/* Consultations */}
      <StatCard
        icon={<Users size={18} className="text-red-600" />}
        iconBg="bg-red-100"
        label="Consultations"
        value={totalConsultations}
        subtitle="All consultations"
      />

      {/* Blood Pressure */}
      <StatCard
        icon={<HeartPulse size={18} className="text-emerald-600" />}
        iconBg="bg-emerald-100"
        label="Blood Pressure"
        value={vitals?.blood_pressure || "—"}
        sparklineData={vitals?.blood_pressure_trend || DEFAULT_TREND}
        sparklineColor="#2E37A4"
      />

      {/* Heart Rate */}
      <StatCard
        icon={<Activity size={18} className="text-blue-600" />}
        iconBg="bg-blue-100"
        label="Heart Rate"
        value={vitals?.heart_rate || "—"}
        sparklineData={vitals?.heart_rate_trend || DEFAULT_TREND}
        sparklineColor="#2F80ED"
      />
    </div>
  );
}