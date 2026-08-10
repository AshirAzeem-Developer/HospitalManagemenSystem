import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { paginateQuery } from '@/lib/paginateQuery'


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const parsedPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const parsedLimit = Number.parseInt(searchParams.get("limit") ?? "10", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10;
  const query = searchParams.get("q")?.trim() ?? "";
  const supabase = await createClient();

  let dbQuery = supabase
    .from("activity_logs")
    .select("id, action, target_table, target_id, created_at, profiles(full_name)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (query) {
    dbQuery = dbQuery.or(`action.ilike.%${query}%,target_table.ilike.%${query}%`);
  }

  const { data, count, totalPages, error } = await paginateQuery(dbQuery, { page, limit });

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

  return NextResponse.json({
    logs: cleanedLogs,
    page,
    limit,
    totalCount: count,
    totalPages,
  });
}