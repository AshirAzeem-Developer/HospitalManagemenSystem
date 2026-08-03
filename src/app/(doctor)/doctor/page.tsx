import { Card } from "@/components/ui/card";

export default function DoctorDashboardPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card label="Today's Appointments" value="—" hint="Wired up in Day 4" />
        <Card label="Total Patients Seen" value="—" hint="Wired up in Day 4" />
      </div>
    </div>
  );
}
