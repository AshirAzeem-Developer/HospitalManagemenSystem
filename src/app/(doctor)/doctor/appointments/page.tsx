import { Card } from "@/components/ui/card";

export default function DoctorAppointmentsPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Doctor Appointments</h1>
      <p className="mt-1 text-sm text-slate-500">View and manage scheduled patient visits.</p>
      <div className="mt-6">
        <Card label="Scheduled Appointments" value="0" hint="Wired up in feature update" />
      </div>
    </div>
  );
}
