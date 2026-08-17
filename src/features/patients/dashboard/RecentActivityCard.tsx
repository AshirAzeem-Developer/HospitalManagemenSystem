type RecentActivityCardProps = {
  appointments?: any[];
  invoices?: any[];
};

export default function RecentActivityCard({
  appointments = [],
  invoices = [],
}: RecentActivityCardProps) {
  // Build a simple activity feed from real appointments + invoices,
  // most recent first.
  const activity = [
    ...appointments.map((a: any) => ({
      id: `apt-${a.id}`,
      color: "bg-emerald-500",
      title: `Appointment with ${a.doctorName || "Doctor"}`,
      time: `${a.date || ""} ${a.time || ""}`.trim(),
      sortKey: a.date ? new Date(a.date).getTime() : 0,
    })),
    ...invoices.map((inv: any) => ({
      id: `inv-${inv.id}`,
      color: "bg-blue-500",
      title: `Invoice ${inv.invoice_number || ""} — $${Number(
        inv.total || 0
      ).toFixed(2)}`,
      time: inv.issued_date
        ? new Date(inv.issued_date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "",
      sortKey: inv.issued_date ? new Date(inv.issued_date).getTime() : 0,
    })),
  ]
    .sort((a, b) => b.sortKey - a.sortKey)
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <h2 className="mb-4 text-base font-semibold text-slate-900">
        Recent Activity
      </h2>

      <div className="space-y-4">
        {activity.length === 0 && (
          <p className="text-sm text-slate-500">No recent activity.</p>
        )}

        {activity.map((a) => (
          <div key={a.id} className="flex items-start gap-3">
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.color}`}
            />

            <div className="min-w-0">
              <p className="text-sm text-slate-700">{a.title}</p>
              <p className="text-xs text-slate-500">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}