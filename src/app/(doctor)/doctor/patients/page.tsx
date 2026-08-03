import { Card } from "@/components/ui/card";

export default function DoctorPatientsPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Doctor Patients</h1>
      <p className="mt-1 text-sm text-slate-500">View medical histories and patient notes.</p>
      <div className="mt-6">
        <Card label="Assigned Patients" value="0" hint="Wired up in feature update" />
      </div>
    </div>
  );
}
