import { Card } from "@/components/ui/card";
import DashboardStatCard from "@/components/ui/DashboardStatCard";

import {
  FaUser,
  FaUserDoctor,
  FaCalendarCheck,
  FaDollarSign,
} from "react-icons/fa6";

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Total Doctors",
      value: 247,
      percentage: 95,
      icon: <FaUserDoctor />,
    },
    {
      title: "Total Patients",
      value: 1200,
      percentage: 82,
      icon: <FaUser />,
    },
    {
      title: "Total Appointments",
      value: 540,
      percentage: 65,
      icon: <FaCalendarCheck />,
    },
    {
      title: "Total Revenue",
      value: 551240,
      percentage: 95,
      icon: <FaDollarSign />,
    },
  ];
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat,key) => (
          
            <DashboardStatCard
              key={key}
              title={stat.title}
              value={stat.value}
              percentage={stat.percentage}
              icon={stat.icon}
            />
          
        ))}
      </div>
    </div>
  );
}
