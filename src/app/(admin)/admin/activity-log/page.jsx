import { Card } from "@/components/ui/card";
import { ActivityLogItem } from "@/components/ui/activity-log-item";
import { cookies } from "next/headers";

export default async function AdminActivityLogPage() {
  const cookieStore = await cookies();
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/activity-log`, {
    cache: "no-store",
    headers: {
      cookie: cookieStore.toString(),
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
  const { logs } = await res.json();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Activity Log</h1>
      <p className="mt-1 text-sm text-slate-500">System audit trail and logs.</p>
      <div className="mt-6">
        <Card label="System Events" value={`${logs.length} Logs`} hint="Wired up in feature update" />
        <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg bg-white overflow-hidden my-1">
          {logs.map((log) => (
            <ActivityLogItem key={log.id} log={log} />
          ))}
        </div>
      </div>
    </div>
  );
}
