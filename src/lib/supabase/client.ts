import { createBrowserClient } from "@supabase/ssr";

// Used inside "use client" components — reads/writes the session
// via the browser's cookies automatically.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
