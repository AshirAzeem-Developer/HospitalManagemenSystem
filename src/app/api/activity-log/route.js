import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activity_logs")
    .select("id, action, target_table, target_id, created_at, profiles(full_name)")
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const cleanedLogs = (data ?? []).map((log) => ({
    id: log.id,
    actor_name: log.profiles?.full_name ?? "Unknown",
    action: log.action,
    target_table: log.target_table,
    target_id: log.target_id,
    created_at: log.created_at,
  }));

  return NextResponse.json({ logs: cleanedLogs });
}