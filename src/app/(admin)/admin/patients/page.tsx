import { Card } from "@/components/ui/card";

export default function AdminPatientsPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Patients</h1>
      <p className="mt-1 text-sm text-slate-500">Manage registered patient records.</p>
      <div className="mt-6">
        <Card label="Registered Patients" value="0" hint="Wired up in feature update" />
      </div>
    </div>
  );
}
