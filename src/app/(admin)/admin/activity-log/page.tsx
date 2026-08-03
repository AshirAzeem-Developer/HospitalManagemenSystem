import { Card } from "@/components/ui/card";

export default function AdminActivityLogPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Activity Log</h1>
      <p className="mt-1 text-sm text-slate-500">System audit trail and logs.</p>
      <div className="mt-6">
        <Card label="System Events" value="0 logs" hint="Wired up in feature update" />
      </div>
    </div>
  );
}
