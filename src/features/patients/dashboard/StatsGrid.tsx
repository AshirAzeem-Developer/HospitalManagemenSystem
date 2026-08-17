import {
  CalendarDays,
  Users,
  HeartPulse,
  Activity,
} from "lucide-react";

type Vitals = {
  blood_pressure?: string | null;
  heart_rate?: string | null;
  spo2?: string | null;
  temperature?: string | null;
  weight?: string | null;
};

type StatsGridProps = {
  totalAppointments: number;
  totalConsultations: number;
  vitals?: Vitals;
};
function StatCard({
  icon,
  iconBg,
  label,
  value,
  unit,
  trend,
  trendUp,
  trendLabel,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string | number;
  unit?: string;
  trend?: string;
  trendUp?: boolean;
  trendLabel?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconBg}`}
        >
          {icon}
        </span>

        <p className="text-sm font-medium text-slate-600">
          {label}
        </p>
      </div>

      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-2xl font-semibold text-slate-900 sm:text-[28px]">
          {value}
        </span>

        {unit && (
          <span className="text-sm font-medium text-slate-500">
            {unit}
          </span>
        )}
      </div>

      {trend && (
        <div className="mt-2 flex items-center gap-2">
          <span
            className={`rounded-md px-1.5 py-0.5 text-xs font-semibold ${
              trendUp
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {trend}
          </span>

          {trendLabel && (
            <span className="text-xs text-slate-500">
              {trendLabel}
            </span>
          )}
        </div>
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

      {/* Total Appointments */}
      <StatCard
        icon={
          <CalendarDays
            size={18}
            className="text-indigo-600"
          />
        }
        iconBg="bg-indigo-100"
        label="Total Appointments"
        value={totalAppointments}
        trendLabel="all time"
      />

      {/* Consultations */}
      <StatCard
  icon={<Users size={18} className="text-red-600" />}
  iconBg="bg-red-100"
  label="Consultations"
  value={totalConsultations}
/>

  {/* blood pressure */}
     <StatCard
  icon={<HeartPulse size={18} className="text-emerald-600" />}
  iconBg="bg-emerald-100"
  label="Blood Pressure"
  value={vitals?.blood_pressure || "—"}
/>
      {/* Pulse Rate */}
     <StatCard
  icon={<Activity size={18} className="text-blue-600" />}
  iconBg="bg-blue-100"
  label="Heart Rate"
  value={vitals?.heart_rate || "—"}
/>
    </div>
  );
}