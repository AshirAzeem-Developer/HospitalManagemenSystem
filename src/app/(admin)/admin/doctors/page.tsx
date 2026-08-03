import { Card } from "@/components/ui/card";

export default function AdminDoctorsPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Doctors</h1>
      <p className="mt-1 text-sm text-slate-500">Manage medical staff and doctor accounts.</p>
      <div className="mt-6">
        <Card label="Active Doctors" value="0" hint="Wired up in feature update" />
      </div>
    </div>
  );
}
