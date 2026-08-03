import { Card } from "@/components/ui/card";

export default function AdminAppointmentsPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Appointments</h1>
      <p className="mt-1 text-sm text-slate-500">Manage all hospital appointments.</p>
      <div className="mt-6">
        <Card label="Total Appointments" value="0" hint="Wired up in feature update" />
      </div>
    </div>
  );
}
