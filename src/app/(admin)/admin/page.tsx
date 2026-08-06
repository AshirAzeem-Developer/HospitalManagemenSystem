import { Card } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Total Doctors" value="—" hint="Wired up in Day 3" />
        <Card label="Total Patients" value="—" hint="Wired up in Day 3" />
        <Card label="Today's Appointments" value="—" hint="Wired up in Day 4" />
        <Card label="Pending Bills" value="—" hint="Wired up in Day 4" />
      </div>
    </div>
  );
}