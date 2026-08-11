import { User, Database, Clock, Hash } from "lucide-react";

export function ActivityLogItem({ log }) {
  const {
    actor_name,
    action,
    target_table,
    target_id,
    created_at,
  } = log;

  const formattedDate = created_at
    ? new Date(created_at).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <tr
      className="
        border-b
        border-slate-200
        bg-white
        transition-colors
        last:border-b-0
        hover:bg-slate-50

        dark:border-slate-800
        dark:bg-slate-900
        dark:hover:bg-slate-800/60
      "
    >
      {/* User */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-slate-100

              dark:bg-slate-800
            "
          >
            <User
              className="
                h-4
                w-4
                text-slate-500

                dark:text-slate-400
              "
            />
          </div>

          <div className="min-w-0">
            <p
              className="
                truncate
                text-sm
                font-medium
                text-slate-900

                dark:text-slate-100
              "
            >
              {actor_name || "Unknown"}
            </p>

            <p
              className="
                mt-0.5
                text-xs
                text-slate-500

                dark:text-slate-400
              "
            >
              System user
            </p>
          </div>
        </div>
      </td>

      {/* Action */}
      <td className="px-4 py-4">
        <span
          className="
            inline-flex
            items-center
            rounded-md
            border
            border-slate-200
            bg-slate-100
            px-2.5
            py-1
            text-xs
            font-medium
            text-slate-700

            dark:border-slate-700
            dark:bg-slate-800
            dark:text-slate-300
          "
        >
          {action || "Unknown action"}
        </span>
      </td>

      {/* Target */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <Database
            className="
              h-4
              w-4
              shrink-0
              text-indigo-500

              dark:text-indigo-400
            "
          />

          <span
            className="
              rounded-md
              border
              border-indigo-100
              bg-indigo-50
              px-2
              py-1
              font-mono
              text-xs
              font-medium
              text-indigo-700

              dark:border-indigo-900/60
              dark:bg-indigo-950/50
              dark:text-indigo-300
            "
          >
            {target_table || "—"}
          </span>
        </div>
      </td>

      {/* Target ID */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5">
          <Hash
            className="
              h-3.5
              w-3.5
              text-slate-400

              dark:text-slate-500
            "
          />

          <code
            className="
              rounded
              bg-slate-100
              px-1.5
              py-0.5
              font-mono
              text-xs
              text-slate-600

              dark:bg-slate-800
              dark:text-slate-400
            "
          >
            {target_id || "—"}
          </code>
        </div>
      </td>

      {/* Date & Time */}
      <td className="whitespace-nowrap px-4 py-4">
        <div
          className="
            flex
            items-center
            gap-2
            text-xs
            text-slate-500

            dark:text-slate-400
          "
        >
          <Clock className="h-3.5 w-3.5 shrink-0" />

          <span>{formattedDate}</span>
        </div>
      </td>
    </tr>
  );
}