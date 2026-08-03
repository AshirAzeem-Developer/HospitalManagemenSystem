import { Card } from "@/components/ui/card";

export default function PatientDashboardPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card label="Upcoming Appointment" value="—" hint="Wired up in Day 4" />
        <Card label="Recent Bill" value="—" hint="Wired up in Day 4" />
      </div>
    </div>
  );
}
