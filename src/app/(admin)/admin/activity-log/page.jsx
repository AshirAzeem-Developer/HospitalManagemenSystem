import { Card } from "@/components/ui/card";
import { ActivityLogItem } from "@/components/ui/activity-log-item";
import PaginationSearchBar from "@/components/ui/PaginationSearchBar";
import PaginationControlsWrapper from "@/components/ui/PaginationControlsWrapper";
import { cookies } from "next/headers";

export default async function AdminActivityLogPage({ searchParams }) {
  const params = await searchParams;

  const parsedPage = Number.parseInt(params.page ?? "1", 10);
  const parsedLimit = Number.parseInt(params.limit ?? "10", 10);

  const page =
    Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const limit =
    Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10;

  const query = params.q ?? "";

  const cookieStore = await cookies();

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (query) {
    queryParams.set("q", query);
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/activity-log?${queryParams.toString()}`,
    {
      cache: "no-store",
      headers: {
        cookie: cookieStore.toString(),
      },
    }
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const {
    logs = [],
    totalCount = 0,
    totalPages = 1,
  } = await res.json();

  return (
    <div>
      {/* Page Header */}
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
        Activity Log
      </h1>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        System audit trail and logs.
      </p>

      <div className="mt-6">
        {/* Summary Card */}
        <Card
          label="System Events"
          value={`${totalCount} Logs`}
          hint={`Page ${page} of ${totalPages}`}
        />

        {/* Search */}
        <div className="mt-4 mb-3">
          <PaginationSearchBar placeholder="Search activity logs" />
        </div>

        {/* Activity Table */}
        <div
          className="
            mt-6
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            bg-white
            shadow-sm

            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              {/* Table Header */}
              <thead>
                <tr
                  className="
                    border-b
                    border-slate-200
                    bg-slate-50

                    dark:border-slate-800
                    dark:bg-slate-950
                  "
                >
                  <th
                    className="
                      px-4 py-3
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-500

                      dark:text-slate-400
                    "
                  >
                    User
                  </th>

                  <th
                    className="
                      px-4 py-3
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-500

                      dark:text-slate-400
                    "
                  >
                    Action
                  </th>

                  <th
                    className="
                      px-4 py-3
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-500

                      dark:text-slate-400
                    "
                  >
                    Target
                  </th>

                  <th
                    className="
                      px-4 py-3
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-500

                      dark:text-slate-400
                    "
                  >
                    ID
                  </th>

                  <th
                    className="
                      px-4 py-3
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-500

                      dark:text-slate-400
                    "
                  >
                    Date & Time
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <ActivityLogItem
                      key={log.id}
                      log={log}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="
                        px-6
                        py-12
                        text-center
                        text-sm
                        text-slate-500

                        dark:text-slate-400
                      "
                    >
                      No activity logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4">
          <PaginationControlsWrapper
            page={page}
            totalPages={totalPages}
            limit={limit}
          />
        </div>
      </div>
    </div>
  );
}