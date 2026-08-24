import DashboardStatCard from "@/components/ui/DashboardStatCard";

import {
  Stethoscope,
  Users,
  CalendarCheck,
  Wallet,
} from "lucide-react";

import {
  getAdminDashboardStats,
  getAppointmentStatistics,
} from "@/features/admin/queries";
import AppointmentStatistics from "@/components/ui/AppointmentStatistics";
export default async function AdminDashboardPage() {
  
  const [
  {
    totalDoctors,
    totalPatients,
    totalAppointments,
    totalRevenue,
  },
  appointmentStats,
] = await Promise.all([
  getAdminDashboardStats(),
  getAppointmentStatistics(),
]);

  const stats = [
    {
      title: "Total Doctors",
      value: totalDoctors,
      icon: <Stethoscope className="h-6 w-6" />,
      iconBg: "bg-indigo-50 dark:bg-indigo-950",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      valueColor: "text-indigo-600",
    },
    {
      title: "Total Patients",
      value: totalPatients,
      icon: <Users className="h-6 w-6" />,
      iconBg: "bg-green-50 dark:bg-green-950",
      iconColor: "text-green-600 dark:text-green-400",
      valueColor: "text-green-600",
    },
    {
      title: "Total Appointments",
      value: totalAppointments,
      icon: <CalendarCheck className="h-6 w-6" />,
      iconBg: "bg-blue-50 dark:bg-blue-950",
      iconColor: "text-blue-600 dark:text-blue-400",
      valueColor: "text-blue-600",
    },
    {
      title: "Total Revenue",
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      icon: <Wallet className="h-6 w-6" />,
      iconBg: "bg-orange-50 dark:bg-orange-950",
      iconColor: "text-orange-600 dark:text-orange-400",
      valueColor: "text-orange-600",
    },
  ];

  return (
    <div>
      {/* Dashboard Heading */}
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
        Dashboard
      </h1>

      {/* Statistics Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <DashboardStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
            valueColor={stat.valueColor}
          />
        ))}
      </div>
      <AppointmentStatistics
  cancelled={appointmentStats.cancelled}
  completed={appointmentStats.completed}
  confirmed={appointmentStats.confirmed}
  pending={appointmentStats.pending}
  monthlyData={appointmentStats.monthlyData}
/>
    </div>
  );
}