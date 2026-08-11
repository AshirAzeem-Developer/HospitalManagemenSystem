import { User, Database, Clock, Hash } from "lucide-react";

export function ActivityLogItem({ log }) {
  const { actor_name, action, target_table, target_id, created_at } = log;

  const formattedDate = new Date(created_at).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 hover:bg-slate-50 transition-colors">
      {/* Left: Actor, Action & Target Details */}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-slate-900 text-sm flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {actor_name}
          </span>
          <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-mono">
            {action}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1 text-slate-700">
            <Database className="w-3 h-3 text-indigo-500 shrink-0" />
            <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100">
              {target_table}
            </span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-0.5 text-slate-400">
            <Hash className="w-3 h-3" />
            {target_id}
          </span>
        </div>
      </div>

      {/* Right: Timestamp */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono shrink-0 sm:self-center">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}