"use client";
 
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
 
interface MonthlyAppointmentData {
  month: string;
  cancelled: number;
  completed: number;
  confirmed: number;
  pending: number;
}
 
interface AppointmentStatisticsProps {
  cancelled: number;
  completed: number;
  confirmed: number;
  pending: number;
  monthlyData: MonthlyAppointmentData[]; // Agar aap ko filter ke liye chahiye tou rehne den
}
 
export default function AppointmentStatistics({
  cancelled,
  completed,
  confirmed,
  pending,
}: AppointmentStatisticsProps) {
 
  // 1. Pie Chart ke liye data format taiyar kiya (Uper wali summary stats ka)
  const pieData = [
    { name: "Cancelled", value: cancelled, color: "#ef4444" },
    { name: "Completed", value: completed, color: "#22c55e" },
    { name: "Confirmed", value: confirmed, color: "#3b82f6" },
    { name: "Pending", value: pending, color: "#eab308" },
  ];
 
  return (
    <div className="mt-6 w-full max-w-5xl rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Appointment Statistics
        </h2>
 
      </div>
 
      {/* Status Summary */}
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Cancelled</p>
          <p className="mt-1 text-xl font-semibold text-red-500">{cancelled}</p>
        </div>
 
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Completed</p>
          <p className="mt-1 text-xl font-semibold text-green-500">{completed}</p>
        </div>
 
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Confirmed</p>
          <p className="mt-1 text-xl font-semibold text-blue-500">{confirmed}</p>
        </div>
 
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
          <p className="mt-1 text-xl font-semibold text-yellow-500">{pending}</p>
        </div>
      </div>
 
      {/* Pie Chart Component */}
      <div className="mt-5 h-[280px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '13px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
 