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
        border-border
        bg-background
        transition-colors
        last:border-b-0
        hover:bg-hover
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
              bg-hover
            "
          >
            <User className="h-4 w-4 text-muted" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {actor_name || "Unknown"}
            </p>

            <p className="mt-0.5 text-xs text-muted">
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
            border-border
            bg-hover
            px-2.5
            py-1
            text-xs
            font-medium
            text-foreground
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
          <Hash className="h-3.5 w-3.5 text-muted" />

          <code
            className="
              rounded
              bg-hover
              px-1.5
              py-0.5
              font-mono
              text-xs
              text-muted
            "
          >
            {target_id || "—"}
          </code>
        </div>
      </td>

      {/* Date & Time */}
      <td className="whitespace-nowrap px-4 py-4">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>{formattedDate}</span>
        </div>
      </td>
    </tr>
  );
}
