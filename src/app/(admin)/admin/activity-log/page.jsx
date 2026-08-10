import { Card } from "@/components/ui/card";
import { ActivityLogItem } from "@/components/ui/activity-log-item";
import PaginationSearchBar from "@/components/ui/PaginationSearchBar";
import PaginationControlsWrapper from "@/components/ui/PaginationControlsWrapper";
import { cookies } from "next/headers";

export default async function AdminActivityLogPage({ searchParams }) {
  const params = await searchParams
  const parsedPage = Number.parseInt(params.page ?? "1", 10)
  const parsedLimit = Number.parseInt(params.limit ?? "10", 10)
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1
  const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10
  const query = params.q ?? ""
  const cookieStore = await cookies();
  const queryParams = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (query) {
    queryParams.set("q", query)
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/activity-log?${queryParams.toString()}`, {
    cache: "no-store",
    headers: {
      cookie: cookieStore.toString(),
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
  const { logs, totalCount, totalPages } = await res.json();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Activity Log</h1>
      <p className="mt-1 text-sm text-slate-500">System audit trail and logs.</p>
      <div className="mt-6">
        <Card label="System Events" value={`${totalCount} Logs`} hint={`Page ${page} of ${totalPages}`} />
        <div className="mt-4 mb-3">
          <PaginationSearchBar placeholder="Search activity logs" />
        </div>
        <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg bg-white overflow-hidden my-1">
          {logs.map((log) => (
            <ActivityLogItem key={log.id} log={log} />
          ))}
        </div>
        <div className="mt-4">
          <PaginationControlsWrapper page={page} totalPages={totalPages} limit={limit} />
        </div>
      </div>
    </div>
  );
}
